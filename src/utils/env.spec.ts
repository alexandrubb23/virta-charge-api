import { isArray } from 'lodash';

import { env } from './env';

describe('env /', () => {
  process.env.ARRAY = '[1, 2, 3]';
  process.env.BOOL = 'true';
  process.env.DATE = '2020-01-01';
  process.env.FLOAT_NUMBER = '1.1';
  process.env.INVALID_JSON = '{key": "value"}';
  process.env.JSON = '{"key": "value"}';
  process.env.NUMBER = '1';

  describe('Without conversion /', () => {
    describe('if an environment variable is defined as a string number', () => {
      it('should return as a string', () => {
        const result = env('NUMBER');

        expect(result).toBe('1');
        expect(typeof result).toBe('string');
      });
    });
  });

  describe('Int converter /', () => {
    describe('if an environment variable is defined as a string number', () => {
      it('should be converted into a number', () => {
        const result = env.int('NUMBER');

        expect(result).toBe(1);
        expect(typeof result).toBe('number');
      });
    });

    describe('if an environment variable is not defined', () => {
      it('should return the default value', () => {
        const result = env.int('NOT_DEFINED', 2);

        expect(result).toBe(2);
        expect(typeof result).toBe('number');
      });
    });
  });

  describe('Float converter /', () => {
    describe('if an environment variable is defined as a string float number', () => {
      it('should be converted to a float number', () => {
        const result = env.float('FLOAT_NUMBER');

        expect(result).toBeCloseTo(1.1);
        expect(typeof result).toBe('number');
      });
    });

    describe('if an environment variable is not defined', () => {
      it('should return the default value', () => {
        const result = env.int('NOT_DEFINED', 2.1);

        expect(result).toBeCloseTo(2.1);
        expect(typeof result).toBe('number');
      });
    });
  });

  describe('Boolean converter /', () => {
    describe('if an environment variable is defined as a string bolean', () => {
      it('should be converted into a boolean', () => {
        const result = env.bool('BOOL');

        expect(result).toBe(true);
        expect(typeof result).toBe('boolean');
      });
    });

    describe('if an environment variable is not defined', () => {
      it('should return the default value', () => {
        const result = env.bool('NOT_DEFINED', false);

        expect(result).toBe(false);
        expect(typeof result).toBe('boolean');
      });
    });
  });

  describe('JSON converter /', () => {
    describe('if an environment variable is defined as a json', () => {
      it('should be converted into a JSON', () => {
        const result = env.json('JSON');

        expect(result).toEqual({ key: 'value' });
        expect(typeof result).toBe('object');
      });
    });

    describe('if is an invalid JSON', () => {
      it('should throw an error', () => {
        expect(() => {
          env.json('INVALID_JSON');
        }).toThrow(/Invalid json environment variable INVALID_JSON/);
      });
    });

    describe('if an environment variable is not defined', () => {
      it('should return the default value', () => {
        const result = env.json('NOT_DEFINED', { key: 'value' });

        expect(result).toEqual({ key: 'value' });
        expect(typeof result).toBe('object');
      });
    });
  });

  describe('Array converter /', () => {
    describe('if an environment variable is defined as an array', () => {
      it('should be converted into Array', () => {
        const result = env.array('ARRAY');

        expect(result).toEqual(expect.arrayContaining(['1', '2', '3']));
        expect(isArray(result)).toBe(true);
      });
    });

    describe('if an environment variable is not defined', () => {
      it('should return the default value', () => {
        const result = env.array('ARRAY', ['1', '2', '3']);

        expect(result).toEqual(expect.arrayContaining(['1', '2', '3']));
        expect(isArray(result)).toBe(true);
      });
    });
  });

  describe('Date converter /', () => {
    describe('if an environment variable is defined as a string date', () => {
      it('should be converted into a Date', () => {
        const result = env.date('DATE') as Date;

        expect(result).toBeInstanceOf(Date);
        expect(result.toISOString()).toBe('2020-01-01T00:00:00.000Z');
      });
    });

    describe('if an environment variable is not defined', () => {
      it('should return the default value', () => {
        const result = env.date('NOT_DEFINED', '2020-01-01T00:00:00.000Z');

        expect(result).toBe('2020-01-01T00:00:00.000Z');
      });
    });
  });
});
