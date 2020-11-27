import {Verify} from 'crypto';
import {Container, TContainer} from '../Container';
import {Dispatch} from '../dispatch';
import {TFn} from '../type/fn.type';

export interface IDataSubscribe<
  T extends TContainer<V, T[V]>,
  V extends string,
  K extends V
> {
  subscribeSet?: Set<TFn<T, T[K], T>>;
}
export type TContainerWithSubscribe<
  U extends {[l in V]: any},
  T extends TContainer<V, T[V]>,
  V extends string
> = {
  [Key in V]?: {
    // data type should be a primitive value fill by the user and not the value of this interface
    // how to do this ??
    subscribeSet?: Set<(bus: T, data: any) => T>;
  };
};

export const subscribe = <
  TClass extends {
    new (...a: any[]): Dispatch<TContainerWithSubscribe<U, T, V>, V>;
  },
  U extends TContainer<V, U[V]>,
  T extends TContainer<V, T[V]>,
  V extends string
>(
  constructor: TClass
) => {
  return class extends constructor {
    constructor(...a: any[]) {
      super(...a);
    }

    subscribe<TK extends V>(key: TK, fn: TFn<T, T[V], T>) {
      const data = this.get(key) ?? ({} as IDataSubscribe<T, V, TK>);
      data.subscribeSet = (data.subscribeSet ?? new Set()).add(fn);
      return this;
    }

    unsubscribe<TK extends V>(key: TK, fn: TFn) {
      const data = this.get(key);
      data?.subscribeSet?.delete(fn);
      return this;
      // this._subscribeSet[key] = this._subscribeSet[key]?.size ? this._subscribeSet[key] : undefined,
    }
  };
};
