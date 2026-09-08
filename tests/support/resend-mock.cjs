// Loaded only by the browser-test server, never imported by application code.
if (process.env.RESEND_API_KEY !== 're_browser_test_dummy') {
  throw new Error('Browser test server requires the dummy Resend key');
}
const originalFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  const url = new URL(typeof input === 'string' || input instanceof URL ? input : input.url);
  if (url.hostname === 'api.resend.com') {
    if (url.pathname !== '/emails' || init?.method !== 'POST') {
      throw new Error('Unexpected mocked provider request');
    }
    const body = JSON.parse(init.body);
    const replyTo = Array.isArray(body.reply_to) ? body.reply_to[0] : body.reply_to;
    if (typeof replyTo !== 'string' || !replyTo.endsWith('@example.test')) {
      throw new Error('Only reserved browser-test addresses are accepted');
    }
    await new Promise(resolve => setTimeout(resolve, 1200));
    if (replyTo.startsWith('exception-')) throw new Error('private-provider-diagnostic');
    if (replyTo.startsWith('failure-')) {
      return Response.json({ name: 'validation_error', message: 'private-provider-diagnostic' }, { status: 422 });
    }
    return Response.json(replyTo.startsWith('missing-id-') ? {} : { id: 'browser-test-message' });
  }
  // Fail closed: an SDK endpoint change must never send a real message.
  if (!['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)) {
    throw new Error('External network disabled in browser-test server');
  }
  return originalFetch(input, init);
};
