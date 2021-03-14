import { restrict } from './restrict';
import {
  CasterFn, Caster, TypeGuard, RuleFn, TypeChecker,
} from './types';
import optional from './optional';
import required from './required';
import map from './map';
import defValue from './default';
import { nullable } from './nullable';

export {
  CasterFn, Caster, TypeGuard, RuleFn, TypeChecker,
};

export const casterApi = <T>(casterFn: CasterFn<T>): Caster<T> =>
  Object.defineProperties(casterFn, {
    ...Object.getOwnPropertyDescriptors(casterFn),
    optional: {
      enumerable: true,
      get: () => casterApi(optional(casterFn)),
    },
    nullable: {
      enumerable: true,
      get: () => casterApi(nullable(casterFn)),
    },
    restrict: {
      enumerable: true,
      value: (...rules: RuleFn<T>[]) => casterApi(restrict(casterFn, rules)),
    },
    map: {
      enumerable: true,
      value: <D>(transform: (value: T) => D) => casterApi(map(casterFn, transform)),
    },
    default: {
      enumerable: true,
      value: <D extends T>(def: D) => casterApi(defValue(casterFn, def)),
    },
  });

export const createCaster: {
  <T>(typeName: string, typeGuard: TypeGuard<T>, transform?: CasterFn<T>): Caster<T>
  <T>(typeName: string, typeGuard: TypeChecker, transform: CasterFn<T>): Caster<T>
} = <T>(
  typeName: string,
  typeGuard: TypeGuard<T> | TypeChecker,
  transform?: CasterFn<T>,
): Caster<T> => casterApi(required(typeName, typeGuard, transform));