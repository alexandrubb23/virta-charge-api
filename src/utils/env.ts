import { has, trim } from 'lodash';

const processEnvironmentHasKey = (key: string) => {
  return has(process.env, key);
};

const getEnvironmentVariable = (key: string, defaultValue?: string) => {
  return processEnvironmentHasKey(key) ? process.env[key] : defaultValue;
};

const utils = {
  int(key: string, defaultValue?: number) {
    if (!processEnvironmentHasKey(key)) {
      return defaultValue;
    }

    const value = process.env[key] as string;
    return parseInt(value, 10);
  },

  float(key: string, defaultValue?: number) {
    if (!processEnvironmentHasKey(key)) {
      return defaultValue;
    }

    const value = process.env[key] as string;
    return parseFloat(value);
  },

  bool(key: string, defaultValue?: boolean) {
    if (!processEnvironmentHasKey(key)) {
      return defaultValue;
    }

    const value = process.env[key];
    return value === 'true';
  },

  json<T>(key: string, defaultValue?: { [key: string]: T }) {
    if (!processEnvironmentHasKey(key)) {
      return defaultValue;
    }

    const value = process.env[key] as string;
    try {
      return JSON.parse(value);
    } catch (error) {
      const ex = error as SyntaxError;

      throw new TypeError(
        `Invalid json environment variable ${key}: ${ex.message}`,
      );
    }
  },

  array<T>(key: string, defaultValue?: T[]) {
    if (!processEnvironmentHasKey(key)) {
      return defaultValue;
    }

    let value = process.env[key] as string;

    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1);
    }

    return value.split(',').map((v) => {
      return trim(trim(v, ' '), '"');
    });
  },

  date(key: string, defaultValue?: string) {
    if (!processEnvironmentHasKey(key)) {
      return defaultValue;
    }

    const value = process.env[key] as string;
    return new Date(value);
  },
};

export const env = Object.assign(getEnvironmentVariable, utils);
