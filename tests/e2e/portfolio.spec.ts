import { test, expect, type Page } from '@playwright/test';

const message = 'Browser integration test: contact delivery.';
const success = 'Message sent. Thank you! I will reply to the email you provided.';
const deliveryFailure = 'Unable to send your message. Please try again later.';

async function fillContact(page: Page, email: string) {
  await page.goto('/#contact');
  await page.locator('#contact-email').fill(email);
  await page.locator('#contact-message').fill(message);
}

async function submit(page: Page) {
  await page.locator('#contact button[type="submit"]').click();
}

test('canonical metadata and generated icon work; policy has no portfolio backlink', async ({ page, request }) => {
  await page.goto('/');
  await expect(page.locator('head > title')).toHaveCount(1);
  await expect(page).toHaveTitle('Mestre Fábio | Personal Portfolio');
  await expect(page.locator('head > meta[name="description"]')).toHaveCount(1);
  await expect(page.locator('head > meta[name="description"]')).toHaveAttribute('content', /full-stack developer/);
  const icon = page.locator('head > link[rel="icon"]');
  await expect(icon).toHaveCount(1);
  const iconUrl = await icon.getAttribute('href');
  expect(iconUrl).toMatch(/^\/icon(?:\?|$)/);
  const response = await request.get(iconUrl!);
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('image/');
  const policy = await page.goto('/whereisluiza.html');
  expect(policy?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveText('Política de privacidade');
  await expect(page.locator('a[href="/"], a[href="https://mestrefabio.com"], a[href="https://mestrefabio.com/"]')).toHaveCount(0);
});

test('success shows pending and clears only the submitted form', async ({ page }) => {
  await fillContact(page, 'success-browser@example.test');
  await page.evaluate(() => {
    const unrelated = document.createElement('form');
    unrelated.innerHTML = '<input name="unrelated" value="keep this value">';
    document.body.prepend(unrelated);
  });
  await submit(page);
  const button = page.locator('#contact button[type="submit"]');
  await expect(button).toBeDisabled();
  await expect(page.getByText(success, { exact: true })).toBeVisible();
  await expect(button).toBeEnabled();
  await expect(page.locator('#contact-email')).toHaveValue('');
  await expect(page.locator('#contact-message')).toHaveValue('');
  await expect(page.locator('[name="unrelated"]')).toHaveValue('keep this value');
});

for (const mode of ['failure', 'exception', 'missing-id']) {
  test(`${mode} from provider preserves fields and shows a safe error`, async ({ page }) => {
    const email = `${mode}-browser@example.test`;
    await fillContact(page, email);
    await submit(page);
    await expect(page.getByText(deliveryFailure, { exact: true })).toBeVisible();
    await expect(page.locator('#contact-email')).toHaveValue(email);
    await expect(page.locator('#contact-message')).toHaveValue(message);
    await expect(page.getByText('private-provider-diagnostic')).toHaveCount(0);
    await expect(page.getByText(success, { exact: true })).toHaveCount(0);
  });
}

test('fourth attempt by the same sender is blocked', async ({ page }) => {
  const email = 'limited-browser@example.test';
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await fillContact(page, email);
    await submit(page);
    await expect(page.getByText(success, { exact: true })).toBeVisible();
    await expect(page.locator('#contact-email')).toHaveValue('');
  }
  await fillContact(page, email);
  await submit(page);
  await expect(page.getByText('Too many attempts. Please try again in 10 minutes.', { exact: true })).toBeVisible();
  await expect(page.locator('#contact-email')).toHaveValue(email);
  await expect(page.locator('#contact-message')).toHaveValue(message);
});

test('browser validation rejects malformed email before sending', async ({ page }) => {
  await fillContact(page, 'not-an-email');
  await submit(page);
  expect(await page.locator('#contact-email').evaluate((element: HTMLInputElement) => element.validity.typeMismatch)).toBe(true);
  await expect(page.locator('#contact-message')).toHaveValue(message);
  await expect(page.getByText(success, { exact: true })).toHaveCount(0);
});
