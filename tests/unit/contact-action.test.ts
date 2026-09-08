import { beforeEach, describe, expect, it, vi } from 'vitest';
const { send } = vi.hoisted(() => ({ send: vi.fn() }));
vi.mock('resend', () => ({ Resend: class { emails = { send }; } }));
const data = (email: unknown = 'person@example.com', message: unknown = 'Hello') => {
  const form = new FormData();
  if (email !== null) form.set('senderEmail', email as string);
  if (message !== null) form.set('message', message as string);
  return form;
};
beforeEach(() => { vi.resetModules(); send.mockReset(); send.mockResolvedValue({ data: { id: 'sent' }, error: null }); });
describe('contact action', () => {
  it.each([[null, 'Hi'], ['invalid', 'Hi'], ['a'.repeat(255)+'@x.com', 'Hi'], ['a@b.com', '   '], ['a@b.com', null], ['a@b.com', 'a'.repeat(5001)], [new File(['x'], 'x'), 'Hi'], ['a@b.com', new File(['x'], 'x')]])('rejects invalid fields %s', async (email, message) => {
    const { sendEmail } = await import('@/actions/sendEmail');
    expect(await sendEmail(data(email, message))).toMatchObject({ success: false, code: 'validation' });
    expect(send).not.toHaveBeenCalled();
  });
  it('reserves budget before awaiting delivery, including failed attempts', async () => {
    const { sendEmail } = await import('@/actions/sendEmail');
    let resolve!: (value: unknown) => void;
    send.mockReturnValue(new Promise(done => { resolve = done; }));
    const pending = [sendEmail(data()), sendEmail(data('PERSON@example.com')), sendEmail(data())];
    expect(await sendEmail(data())).toEqual({ success: false, code: 'rate_limit' });
    expect(send).toHaveBeenCalledTimes(3);
    resolve({ data: null, error: { message: 'SECRET' } });
    expect(await Promise.all(pending)).toEqual(Array(3).fill({ success: false, code: 'delivery' }));
    expect(await sendEmail(data())).toEqual({ success: false, code: 'rate_limit' });
  });
  it('enforces global budget across distinct identities', async () => {
    const { sendEmail } = await import('@/actions/sendEmail');
    for (let i = 0; i < 20; i++) expect(await sendEmail(data(`${i}@example.com`))).toEqual({ success: true });
    expect(await sendEmail(data('last@example.com'))).toEqual({ success: false, code: 'rate_limit' });
    expect(send).toHaveBeenCalledTimes(20);
  });
  it('trims fields and accepts provider confirmation', async () => {
    const { sendEmail } = await import('@/actions/sendEmail');
    expect(await sendEmail(data(' person@example.com ', ' Hello '))).toEqual({ success: true });
    expect(send.mock.calls[0][0].replyTo).toBe('person@example.com');
    expect(send.mock.calls[0][0].react.props.message).toBe('Hello');
  });
  it.each([{ data: null, error: { message: 'SECRET' } }, { data: {}, error: null }, { data: null, error: null }])('sanitizes provider failure', async result => {
    send.mockResolvedValue(result);
    const { sendEmail } = await import('@/actions/sendEmail');
    expect(await sendEmail(data())).toEqual({ success: false, code: 'delivery' });
  });
  it('sanitizes thrown exceptions', async () => {
    send.mockRejectedValue(new Error('SECRET'));
    const { sendEmail } = await import('@/actions/sendEmail');
    expect(await sendEmail(data())).toEqual({ success: false, code: 'delivery' });
  });
});
