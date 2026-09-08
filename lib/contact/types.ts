export type ContactResult =
  | { success: true }
  | { success: false; code: 'validation' | 'rate_limit' | 'delivery' };
