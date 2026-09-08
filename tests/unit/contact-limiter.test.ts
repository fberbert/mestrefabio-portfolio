import { describe, expect, it } from 'vitest';
import { createContactLimiter } from '@/lib/contact/limiter';
describe('contact limiter', () => {
  it('reserves per-email budget synchronously and expires at ten minutes', () => {
    let now = 0; const limit = createContactLimiter(() => now);
    expect([limit('a@b.com'), limit('A@B.COM'), limit('a@b.com'), limit('a@b.com')]).toEqual([true,true,true,false]);
    now = 600000; expect(limit('a@b.com')).toBe(true);
  });
  it('recovers from a clock rollback', () => {
    let now = 500; const limit = createContactLimiter(() => now);
    for (let i = 0; i < 3; i++) expect(limit('a@b.com')).toBe(true);
    now = 0; expect(limit('a@b.com')).toBe(true);
  });
  it('caps all identities and resets bounded state', () => {
    let now = 0; const limit = createContactLimiter(() => now);
    for (let i=0;i<20;i++) expect(limit(`${i}@x.com`)).toBe(true);
    expect(limit('new@x.com')).toBe(false);
    now = 600000; expect(limit('new@x.com')).toBe(true);
  });
});
