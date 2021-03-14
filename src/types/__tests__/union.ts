import { union } from '../..';
import { int } from '../int';
import { str } from '../str';

describe('union', () => {
  describe('Caster Interface', () => {
    it('union(int, str).name === "integer|string"', () => {
      expect(union(int, str).name).toBe('integer|string');
    });

    it.each([
      ['optional'],
      ['nullable'],
      ['restrict'],
      ['map'],
      ['default'],
    ])('union(int, str).%s is a Function', methodName => {
      expect((union(int, str) as any)[methodName]).toBeInstanceOf(Function);
    });
  });

  describe('specific', () => {
    it('throws error if no caster is specified', () => {
      expect(() => (union as any)()).toThrow(new Error('At least two types should be specified.'));
    });

    it('throws error if one caster is specified', () => {
      expect(() => (union as any)(int)).toThrow(new Error('At least two types should be specified.'));
    });

    it('doesn\'t call the second type caster if value matches the first one ', () => {
      const intSpy = jest.fn(int);
      const strSpy = jest.fn(str);
      const intOrStr = union(intSpy, strSpy);

      expect(intOrStr(1)).toBe(1);

      expect(intSpy).toHaveBeenCalledWith(1, undefined);
      expect(strSpy).not.toHaveBeenCalled();
    });
  });

  describe('::required', () => {
    const intOrStr = union(int, str);

    it.each([
      [Number.MIN_SAFE_INTEGER],
      [Number.MAX_SAFE_INTEGER],
      [-100],
      [0],
      [100],
      [''],
      ['hello world'],
    ])('bypasses %s', value => {
      expect(intOrStr(value)).toBe(value);
    });

    it.each([
      [null],
      [undefined],
      [Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY],
      [-Math.PI],
      [Math.PI],
      [false],
      [true],
      [{}],
      [{ value: 1 }],
      [[]],
      [[1, 2, 3]],
    ])('throws TypeError for %s', value => {
      expect(() => intOrStr(value)).toThrow(
        new TypeError(`integer|string is expected but "${value}" received.`),
      );
    });

    it.each([
      [null],
      [undefined],
      [Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY],
      [-Math.PI],
      [Math.PI],
      [false],
      [true],
      [{}],
      [{ value: 1 }],
      [[]],
      [[1, 2, 3]],
    ])('throws TypeError for %s', value => {
      expect(() => intOrStr(value, 'field')).toThrow(
        new TypeError(`integer|string is expected in field but "${value}" received.`),
      );
    });
  });
});
