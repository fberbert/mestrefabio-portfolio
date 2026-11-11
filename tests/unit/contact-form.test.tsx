import React from 'react';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ContactForm from '@/components/contact-form';
import type { ContactResult } from '@/lib/contact/types';
vi.mock('@/actions/sendEmail', () => ({ sendEmail: vi.fn() }));
vi.mock('@/context/language-context', () => ({ useLang: () => ({ t: (key: string) => key }) }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });
function fill() {
  fireEvent.change(screen.getByLabelText('contact.email'), { target: { value: 'person@example.com' } });
  fireEvent.change(screen.getByLabelText('contact.message'), { target: { value: 'Hello' } });
  fireEvent.submit(screen.getByRole('button').closest('form')!);
}
describe('contact form', () => {
  it('disables while pending and clears its own fields on success', async () => {
    let resolve!: (result: ContactResult) => void;
    const action = vi.fn(() => new Promise<ContactResult>(done => { resolve = done; }));
    render(<><form><input aria-label="unrelated" defaultValue="keep" /></form><ContactForm action={action} /></>);
    fill();
    await waitFor(() => expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(true));
    await act(async () => resolve({ success: true }));
    await waitFor(() => expect((screen.getByLabelText('contact.email') as HTMLInputElement).value).toBe(''));
    expect((screen.getByLabelText('contact.message') as HTMLTextAreaElement).value).toBe('');
    expect((screen.getByLabelText('unrelated') as HTMLInputElement).value).toBe('keep');
    expect(screen.getByRole('status').textContent).toBe('contact.success');
    expect((screen.getByRole('button') as HTMLButtonElement).disabled).toBe(false);
  });
  it.each(['delivery', 'validation', 'rate_limit', 'reject'])('preserves values and shows safe error for %s', async code => {
    const action = vi.fn(async (): Promise<ContactResult> => {
      if (code === 'reject') throw new Error('SECRET');
      return { success: false, code: code as 'delivery' | 'validation' | 'rate_limit' };
    });
    render(<ContactForm action={action} />); fill();
    await waitFor(() => expect(screen.getByRole('status').textContent).toBe(`contact.${code === 'reject' ? 'delivery' : code}`));
    expect((screen.getByLabelText('contact.email') as HTMLInputElement).value).toBe('person@example.com');
    expect((screen.getByLabelText('contact.message') as HTMLTextAreaElement).value).toBe('Hello');
    expect(screen.queryByText('SECRET')).toBeNull();
  });
});
