import { num } from '..';
import { toBe } from '../validation';

const lt = (max: number) =>
  toBe((value: number) => value < max, `less then ${max}`);

const gt = (min: number) =>
  toBe((value: number) => value > min, `greater then ${min}`);

const eq = (target: number) =>
  toBe((value: number) => value === target, `equal to ${target}`);

const neq = (unwanted: number) =>
  toBe((value: number) => value !== unwanted, `not equal to ${unwanted}`);

describe('num', () => {
  describe('Caster interface', () => {
    it('num.name === "number"', () => {
      expect(num.name).toBe('number');
    });

    it('num.optional is a Function', () => {
      expect(num.optional).toBeInstanceOf(Function);
    });

    it('num.nullable is a Function', () => {
      expect(num.nullable).toBeInstanceOf(Function);
    });

    it('num.validate is a Function', () => {
      expect(num.validate).toBeInstanceOf(Function);
    });

    it('num.map is a Function', () => {
      expect(num.map).toBeInstanceOf(Function);
    });

    it('num.default is a Function', () => {
      expect(num.default).toBeInstanceOf(Function);
    });
  });

  describe('::required:ok', () => {
    it.each([
      [Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY],
      [-100],
      [-Math.PI],
      [0],
      [100],
      [Math.PI],
    ])('bypases %s', value => {
      expect(num(value)).toBe(value);
    });
  });

  describe('::required:fail', () => {
    it.each([
      [null],
      [undefined],
      [''],
      ['hello world'],
      [false],
      [true],
      [{}],
      [{ value: 1 }],
      [[]],
      [[1, 2, 3]],
    ])('throws a TypeError for "%s"', invalidValue => {
      expect(
        () => num(invalidValue),
      ).toThrow(new TypeError(`number is expected but "${invalidValue}" received.`));
    });
  });

  describe('::required:fail (context)', () => {
    it.each([
      [null],
      [undefined],
      [''],
      ['hello world'],
      [false],
      [true],
      [{}],
      [{ value: 1 }],
      [[]],
      [[1, 2, 3]],
    ])('throws a TypeError for "%s" (with context info)', invalidValue => {
      expect(
        () => num(invalidValue, 'param'),
      ).toThrow(new TypeError(`number is expected in param but "${invalidValue}" received.`));
    });
  });

  describe('num.optional:ok', () => {
    it.each([
      [null],
      [undefined],
      [Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY],
      [-100],
      [-Math.PI],
      [0],
      [100],
      [Math.PI],
    ])('bypases %s', value => {
      expect(num.optional(value)).toBe(value);
    });
  });
  describe('num.optional:fail', () => {
    it.each([
      [''],
      ['hello world'],
      [false],
      [true],
      [{}],
      [{ value: 1 }],
      [[]],
      [[1, 2, 3]],
    ])('throws a TypeError for "%s"', invalidValue => {
      expect(
        () => num.optional(invalidValue),
      ).toThrow(new TypeError(`number is expected but "${invalidValue}" received.`));
    });
  });

  describe('num.optional:fail (context)', () => {
    it.each([
      [''],
      ['hello world'],
      [false],
      [true],
      [{}],
      [{ value: 1 }],
      [[]],
      [[1, 2, 3]],
    ])('throws a TypeError for "%s" (with context info)', invalidValue => {
      expect(
        () => num.optional(invalidValue, 'param'),
      ).toThrow(new TypeError(`number is expected in param but "${invalidValue}" received.`));
    });
  });

  describe('num.default(1000):ok', () => {
    it.each([
      [undefined],
      [Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY],
      [-100],
      [-Math.PI],
      [0],
      [100],
      [Math.PI],
    ])('bypases %s', value => {
      expect(num.default(1000)(value)).toBe(value !== undefined ? value : 1000);
    });
  });
  describe('num.default(1000):fail', () => {
    it.each([
      [null],
      [''],
      ['hello world'],
      [false],
      [true],
      [{}],
      [{ value: 1 }],
      [[]],
      [[1, 2, 3]],
    ])('throws a TypeError for "%s"', invalidValue => {
      expect(
        () => num.default(1000)(invalidValue),
      ).toThrow(new TypeError(`number is expected but "${invalidValue}" received.`));
    });
  });

  describe('num.default(1000):fail (context)', () => {
    it.each([
      [null],
      [''],
      ['hello world'],
      [false],
      [true],
      [{}],
      [{ value: 1 }],
      [[]],
      [[1, 2, 3]],
    ])('throws a TypeError for "%s" (with context info)', invalidValue => {
      expect(
        () => num.default(1000)(invalidValue, 'param'),
      ).toThrow(new TypeError(`number is expected in param but "${invalidValue}" received.`));
    });
  });

  describe('num.validate:ok', () => {
    it.each([
      [Number.NEGATIVE_INFINITY, lt(0)],
      [Number.POSITIVE_INFINITY, gt(0)],
      [-100, lt(0)],
      [-Math.PI, lt(0)],
      [0, eq(0)],
      [100, gt(0)],
      [Math.PI, gt(0)],
    ])('successfully validates %s with rule', (value, rule) => {
      const spy = jest.fn(rule);
      expect(num.validate(spy)(value)).toBe(value);
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(value);
    });
  });

  describe('num.validate:fail', () => {
    it.each([
      [Number.NEGATIVE_INFINITY, gt(0), 'greater then 0'],
      [Number.POSITIVE_INFINITY, lt(0), 'less then 0'],
      [-100, gt(0), 'greater then 0'],
      [-Math.PI, gt(0), 'greater then 0'],
      [0, neq(0), 'not equal to 0'],
      [100, lt(0), 'less then 0'],
      [Math.PI, lt(0), 'less then 0'],
    ])('validates %s with rule and throws an error', (value, rule, message) => {
      const spy = jest.fn(rule);
      const errorMessage = `expected value is ${message} but received ${value}.`;
      expect(
        () => num.validate(spy)(value),
      ).toThrow(new TypeError(errorMessage));
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(value);
    });
  });

  describe('num.validate:fail (context)', () => {
    it.each([
      [Number.NEGATIVE_INFINITY, gt(0), 'greater then 0'],
      [Number.POSITIVE_INFINITY, lt(0), 'less then 0'],
      [-100, gt(0), 'greater then 0'],
      [-Math.PI, gt(0), 'greater then 0'],
      [0, neq(0), 'not equal to 0'],
      [100, lt(0), 'less then 0'],
      [Math.PI, lt(0), 'less then 0'],
    ])('validates %s with rule and throws an error (with context)', (value, rule, message) => {
      const spy = jest.fn(rule);
      const errorMessage = `param should be ${message} but received ${value}.`;
      expect(
        () => num.validate(spy)(value, 'param'),
      ).toThrow(new TypeError(errorMessage));
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(value);
    });
  });
  describe('num.validate:skip invalid', () => {
    it.each([
      [null],
      [undefined],
      [''],
      ['hello world'],
      [false],
      [true],
      [{}],
      [{ value: 1 }],
      [[]],
      [[1, 2, 3]],
    ])('throws a TypeError for "%s" and doesn\'t call rule', invalidValue => {
      const rule = jest.fn().mockReturnValue(null); // rule returns null on success
      expect(
        () => num.validate(rule)(invalidValue),
      ).toThrow(new TypeError(`number is expected but "${invalidValue}" received.`));

      expect(rule).not.toBeCalled();
    });
  });

  describe('num.optional.validate:ok', () => {
    it.each([
      [Number.NEGATIVE_INFINITY, lt(0)],
      [Number.POSITIVE_INFINITY, gt(0)],
      [-100, lt(0)],
      [-Math.PI, lt(0)],
      [0, eq(0)],
      [100, gt(0)],
      [Math.PI, gt(0)],
    ])('successfully validates %s with rule', (value, rule) => {
      const spy = jest.fn(rule);
      expect(num.optional.validate(spy)(value)).toBe(value);
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(value);
    });
  });

  describe('num.optional.validate:failed', () => {
    it.each([
      [Number.NEGATIVE_INFINITY, gt(0), 'greater then 0'],
      [Number.POSITIVE_INFINITY, lt(0), 'less then 0'],
      [-100, gt(0), 'greater then 0'],
      [-Math.PI, gt(0), 'greater then 0'],
      [0, neq(0), 'not equal to 0'],
      [100, lt(0), 'less then 0'],
      [Math.PI, lt(0), 'less then 0'],
    ])('validates %s with rule and throws an error', (value, rule, message) => {
      const spy = jest.fn(rule);
      const errorMessage = `expected value is ${message} but received ${value}.`;
      expect(
        () => num.optional.validate(spy)(value),
      ).toThrow(new TypeError(errorMessage));
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(value);
    });
  });

  describe('num.optional.validate: empty is skipped', () => {
    it.each([
      [null],
      [undefined],
    ])('bypasses %s and doesn\'t call rule', value => {
      const rule = jest.fn();
      expect(num.optional.validate(rule)(value)).toBe(value);
      expect(rule).not.toBeCalled();
    });
  });

  describe('num.optional.validate: fail - validation skiped', () => {
    it.each([
      [''],
      ['hello world'],
      [false],
      [true],
      [{}],
      [{ value: 1 }],
      [[]],
      [[1, 2, 3]],
    ])('throws a TypeError for "%s" and doesn\'t call rule', invalidValue => {
      const rule = jest.fn().mockReturnValue(null); // rule returns null on success
      expect(
        () => num.optional.validate(rule)(invalidValue),
      ).toThrow(new TypeError(`number is expected but "${invalidValue}" received.`));

      expect(rule).not.toBeCalled();
    });
  });

  describe('num.validate().optional: ok', () => {
    it.each([
      [Number.NEGATIVE_INFINITY, lt(0)],
      [Number.POSITIVE_INFINITY, gt(0)],
      [-100, lt(0)],
      [-Math.PI, lt(0)],
      [0, eq(0)],
      [100, gt(0)],
      [Math.PI, gt(0)],
    ])('successfully validates %s with rule', (value, rule) => {
      const spy = jest.fn(rule);
      expect(num.validate(spy).optional(value)).toBe(value);
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(value);
    });
  });
  describe('num.optional.validate: validation failed', () => {
    it.each([
      [Number.NEGATIVE_INFINITY, gt(0), 'greater then 0'],
      [Number.POSITIVE_INFINITY, lt(0), 'less then 0'],
      [-100, gt(0), 'greater then 0'],
      [-Math.PI, gt(0), 'greater then 0'],
      [0, neq(0), 'not equal to 0'],
      [100, lt(0), 'less then 0'],
      [Math.PI, lt(0), 'less then 0'],
    ])('validates %s with rule and throws an error', (value, rule, message) => {
      const spy = jest.fn(rule);
      const errorMessage = `expected value is ${message} but received ${value}.`;
      expect(
        () => num.validate(spy).optional(value),
      ).toThrow(new TypeError(errorMessage));
      expect(spy).toBeCalledTimes(1);
      expect(spy).toBeCalledWith(value);
    });
  });

  describe('num.optional.validate: skip empty', () => {
    it.each([
      [null],
      [undefined],
    ])('bypasses %s and doesn\'t call rule', value => {
      const rule = jest.fn();
      expect(num.validate(rule).optional(value)).toBe(value);
      expect(rule).not.toBeCalled();
    });
  });

  describe('num.optional.validate: skip invalid', () => {
    it.each([
      [''],
      ['hello world'],
      [false],
      [true],
      [{}],
      [{ value: 1 }],
      [[]],
      [[1, 2, 3]],
    ])('throws a TypeError for "%s" and doesn\'t call rule', invalidValue => {
      const rule = jest.fn().mockReturnValue(null); // rule returns null on success
      expect(
        () => num.validate(rule).optional(invalidValue),
      ).toThrow(new TypeError(`number is expected but "${invalidValue}" received.`));

      expect(rule).not.toBeCalled();
    });
  });
});
