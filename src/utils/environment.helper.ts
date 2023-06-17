import { env } from './env.helper';

const NODE_ENV = env('NODE_ENV');

export const isProduction = NODE_ENV === 'production';
export const isTest = NODE_ENV === 'test';
export const isDevelopment = !isProduction && !isTest;
