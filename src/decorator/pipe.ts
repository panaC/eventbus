import { enableMapSet} from 'immer';
import {TContainer} from '../Container';
import {Dispatch} from '../Dispatch';
import {TFn, TMaybePromise} from '../type/fn.type';

// enable Map And Set in immer .. Not pure ! why ?
enableMapSet();

export interface IDataPipe<
  // T extends TContainer<V, T[V]>,
  // V extends string,
  // K extends V
  V
> {
  subscribeSet?: Set<TFn<any, V>>;
}
export type TContainerWithPipe<V extends string, X = any> = {
  [Key in V]?: {
    pipeSet?: Set<TFn<any, X, X>>; // how to remove second any : T[Key] doesn't works
  };
};

export interface IPipe<
  T extends TContainer<V, T[V]>,
  V extends string
> {
  pipe: <TK extends V>(key: TK, fn: TFn<this, T[TK], T[TK]>) => this;
  unpipe: <TK extends V>(key: TK, fn: TFn) => this;
}

export const pipe = <
  TClass extends {
    new (...a: any[]): Dispatch<U, T, V>;
  },
  U extends TContainer<V, U[V]>,
  T extends TContainerWithPipe<V>,
  V extends string
>(
  constructor: TClass
) => {
  return class extends constructor {
    constructor(...a: any[]) {
      super(...a);
    }

    dispatch<TK extends V>(key: TK, value: TMaybePromise<U[TK]>) {

        console.log("PIPE dispatch", key, value);
        
        const data = this.get(key);
        if (data?.pipeSet) {
            value = Array.from(data.pipeSet).reduce((pv, fn) => pv.then(v => Promise.resolve(fn(this, v))), Promise.resolve(value));
        }

      return super.dispatch(key, value);
    }

    pipe<TK extends V>(key: TK, fn: TFn) {
        console.log("PIPE pipe", key, fn);
        
      const data = this.getDraft(key, {} as T[TK]);
      if (data) {
        data.pipeSet = (data.pipeSet ?? new Set()).add(fn);
        this.set(key, data);
      }
      return this;
    }

    unpipe<TK extends V>(key: TK, fn: TFn) {
        console.log("PIPE unpipe", key, fn);
      const data = this.getDraft(key, {} as T[TK]);
      data?.pipeSet?.delete(fn);
      this.set(key, data);
      return this;
    }
  };
};
