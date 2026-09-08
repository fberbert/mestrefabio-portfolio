import { createHash } from 'node:crypto';

const WINDOW_MS = 10 * 60 * 1000;
const GLOBAL_LIMIT = 20;
const EMAIL_LIMIT = 3;

/** Single-process fixed windows: restart clears quotas; boundary bursts can reach 40. */
export function createContactLimiter(now: () => number = Date.now) {
  let state: { start: number; total: number; identities: Readonly<Record<string, number>> } = {
    start: now(), total: 0, identities: {},
  };
  return (email: string): boolean => {
    const time = now();
    const current = time < state.start || time - state.start >= WINDOW_MS
      ? { start: time, total: 0, identities: {} as Readonly<Record<string, number>> }
      : state;
    if (current.total >= GLOBAL_LIMIT) return false;
    const key = createHash('sha256').update(email.trim().toLowerCase()).digest('hex');
    const count = current.identities[key] ?? 0;
    if (count >= EMAIL_LIMIT) return false;
    state = { ...current, total: current.total + 1, identities: { ...current.identities, [key]: count + 1 } };
    return true;
  };
}

export const reserveContactAttempt = createContactLimiter();
