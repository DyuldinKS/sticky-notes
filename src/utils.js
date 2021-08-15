export const generateId = (size = 32) =>
  Array.from(crypto.getRandomValues(new Uint8Array(size)))
    .map(v => v.toString(16).padStart(2, '0'))
    .join('');

export const fitIntoInterval = (min, max, val) => (val ? Math.max(min, Math.min(max, val)) : min);

export const logger = process.NODE_ENV === 'production' ? { log: () => {} } : console;
