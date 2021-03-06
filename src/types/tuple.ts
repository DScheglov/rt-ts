import { createCaster } from '../engine';
import { isATuple } from '../engine/guards';
import {
  CasterFn, Caster, Tuple, TupleSchema, TypeGuard, ErrorReporter,
} from '../engine/types';

const transformTuple = <T extends Tuple>(schema: TupleSchema<T>) =>
  (value: unknown, context?: string, reportError?: ErrorReporter) => {
    const casted = ((schema as any[]).map(
      (caster, index) => caster(
        (value as any[])[index],
        context ? `${context}[${index}]` : `#${index}`,
        reportError,
      ),
    ) as any) as T;

    const last = (value as any[]).length - 1;

    return (casted as Array<any> & T).slice(0, last + 1) as any as T;
  };

const tupleTypeName = (schema: CasterFn<any>[]) => `[${schema.map(casterFn => casterFn.name).join(', ')}]`;

export const tuple: {
  <A>(casterA: CasterFn<A>): Caster<[A]>;
  <A, B>(casterA: CasterFn<A>, casterB: CasterFn<B>): Caster<[A, B]>;
  <A, B, C>(
    casterA: CasterFn<A>,
    casterB: CasterFn<B>,
    casterC: CasterFn<C>,
  ): Caster<[A, B, C]>;
  <A, B, C, D>(
    casterA: CasterFn<A>,
    casterB: CasterFn<B>,
    casterC: CasterFn<C>,
    casterD: CasterFn<D>,
  ): Caster<[A, B, C, D]>;
  <A, B, C, D, E>(
    casterA: CasterFn<A>,
    casterB: CasterFn<B>,
    casterC: CasterFn<C>,
    casterD: CasterFn<D>,
    casterE: CasterFn<E>,
  ): Caster<[A, B, C, D, E]>;
  <A, B, C, D, E, F>(
    casterA: CasterFn<A>,
    casterB: CasterFn<B>,
    casterC: CasterFn<C>,
    casterD: CasterFn<D>,
    casterE: CasterFn<E>,
    casterF: CasterFn<F>,
  ): Caster<[A, B, C, D, E, F]>;
  <A, B, C, D, E, F, G>(
    casterA: CasterFn<A>,
    casterB: CasterFn<B>,
    casterC: CasterFn<C>,
    casterD: CasterFn<D>,
    casterE: CasterFn<E>,
    casterF: CasterFn<F>,
    casterG: CasterFn<G>,
  ): Caster<[A, B, C, D, E, F, G]>;
  <A, B, C, D, E, F, G, H>(
    casterA: CasterFn<A>,
    casterB: CasterFn<B>,
    casterC: CasterFn<C>,
    casterD: CasterFn<D>,
    casterE: CasterFn<E>,
    casterF: CasterFn<F>,
    casterG: CasterFn<G>,
    casterH: CasterFn<H>,
  ): Caster<[A, B, C, D, E, F, G, H]>;
  <A, B, C, D, E, F, G, H, I>(
    casterA: CasterFn<A>,
    casterB: CasterFn<B>,
    casterC: CasterFn<C>,
    casterD: CasterFn<D>,
    casterE: CasterFn<E>,
    casterF: CasterFn<F>,
    casterG: CasterFn<G>,
    casterH: CasterFn<H>,
    casterI: CasterFn<I>,
  ): Caster<[A, B, C, D, E, F, G, H, I]>;
  <A, B, C, D, E, F, G, H, I, J>(
    casterA: CasterFn<A>,
    casterB: CasterFn<B>,
    casterC: CasterFn<C>,
    casterD: CasterFn<D>,
    casterE: CasterFn<E>,
    casterF: CasterFn<F>,
    casterG: CasterFn<G>,
    casterH: CasterFn<H>,
    casterI: CasterFn<I>,
    casterJ: CasterFn<J>,
  ): Caster<[A, B, C, D, E, F, G, H, I, J]>;
  <A, B, C, D, E, F, G, H, I, J, K>(
    casterA: CasterFn<A>,
    casterB: CasterFn<B>,
    casterC: CasterFn<C>,
    casterD: CasterFn<D>,
    casterE: CasterFn<E>,
    casterF: CasterFn<F>,
    casterG: CasterFn<G>,
    casterH: CasterFn<H>,
    casterI: CasterFn<I>,
    casterJ: CasterFn<J>,
    casterK: CasterFn<K>,
  ): Caster<[A, B, C, D, E, F, G, H, I, J, K]>;
  <A, B, C, D, E, F, G, H, I, J, K, L>(
    casterA: CasterFn<A>,
    casterB: CasterFn<B>,
    casterC: CasterFn<C>,
    casterD: CasterFn<D>,
    casterE: CasterFn<E>,
    casterF: CasterFn<F>,
    casterG: CasterFn<G>,
    casterH: CasterFn<H>,
    casterI: CasterFn<I>,
    casterJ: CasterFn<J>,
    casterK: CasterFn<K>,
    casterL: CasterFn<L>,
  ): Caster<[A, B, C, D, E, F, G, H, I, J, K, L]>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M>(
    casterA: CasterFn<A>,
    casterB: CasterFn<B>,
    casterC: CasterFn<C>,
    casterD: CasterFn<D>,
    casterE: CasterFn<E>,
    casterF: CasterFn<F>,
    casterG: CasterFn<G>,
    casterH: CasterFn<H>,
    casterI: CasterFn<I>,
    casterJ: CasterFn<J>,
    casterK: CasterFn<K>,
    casterL: CasterFn<L>,
    casterM: CasterFn<M>,
  ): Caster<[A, B, C, D, E, F, G, H, I, J, K, L, M]>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N>(
    casterA: CasterFn<A>,
    casterB: CasterFn<B>,
    casterC: CasterFn<C>,
    casterD: CasterFn<D>,
    casterE: CasterFn<E>,
    casterF: CasterFn<F>,
    casterG: CasterFn<G>,
    casterH: CasterFn<H>,
    casterI: CasterFn<I>,
    casterJ: CasterFn<J>,
    casterK: CasterFn<K>,
    casterL: CasterFn<L>,
    casterM: CasterFn<M>,
    casterN: CasterFn<N>,
  ): Caster<[A, B, C, D, E, F, G, H, I, J, K, L, M, N]>;
  <A, B, C, D, E, F, G, H, I, J, K, L, M, N, O>(
    casterA: CasterFn<A>,
    casterB: CasterFn<B>,
    casterC: CasterFn<C>,
    casterD: CasterFn<D>,
    casterE: CasterFn<E>,
    casterF: CasterFn<F>,
    casterG: CasterFn<G>,
    casterH: CasterFn<H>,
    casterI: CasterFn<I>,
    casterJ: CasterFn<J>,
    casterK: CasterFn<K>,
    casterL: CasterFn<L>,
    casterM: CasterFn<M>,
    casterN: CasterFn<N>,
    casterO: CasterFn<O>,
  ): Caster<[A, B, C, D, E, F, G, H, I, J, K, L, M, N, O]>;
} = <T extends Tuple>(...schema: Array<any> & TupleSchema<T>) =>
  createCaster(tupleTypeName(schema), isATuple as TypeGuard<T>, transformTuple(schema));
