export const logger = process.NODE_ENV === 'production' ? { log: () => {} } : console;
