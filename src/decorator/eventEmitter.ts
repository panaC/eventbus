import {createDraft, enableMapSet} from 'immer';
import {Draft, Drafted} from 'immer/dist/internal';
import {TContainer} from '../Container';
import {Dispatch} from '../Dispatch';
import {TFn, TMaybePromise} from '../type/fn.type';

// enable Map And Set in immer .. Not pure ! why ?
enableMapSet();

export interface IDataEventEmitter<
  // T extends TContainer<V, T[V]>,
  // V extends string,
  // K extends V
  V
> {
  subscribeSet?: Set<TFn<any, V>>;
}
export type TContainerWithEventEmitter<V extends string> = {
  [Key in V]?: {
    subscribeSet?: Set<TFn<any, any>>; // how to remove second any : T[Key] doesn't works
  };
};

export interface IEventEmitter<
  T extends TContainer<V, T[V]>,
  V extends string
> {
  subscribe: <TK extends V>(key: TK, fn: TFn<this, T[TK]>) => this;
  unsubscribe: <TK extends V>(key: TK, fn: TFn) => this;
}

export const eventEmitter = <
  TClass extends {
    new (...a: any[]): Dispatch<U, T, V>;
  },
  U extends TContainer<V, U[V]>,
  T extends TContainerWithEventEmitter<V>,
  V extends string
>(
  constructor: TClass
) => {
  return class extends constructor {
    constructor(...a: any[]) {
      super(...a);
    }

    dispatch<TK extends V>(key: TK, value: TMaybePromise<U[TK]>) {
      console.log("EE dispatch", key, value);
      
      // run on next tick, but unsubscribed before !! 
      Promise.resolve(value).then(v => {
        const data = this.get(key);
        if (data?.subscribeSet) {
          data.subscribeSet?.forEach(fn => fn(this, v));
        }
      });

      return super.dispatch(key, value);
    }

    subscribe<TK extends V>(key: TK, fn: TFn) {
      console.log("EE subscribe", key, fn);
      
      const data = this.getDraft(key, {} as T[TK]);
      if (data) {
        data.subscribeSet = (data.subscribeSet ?? new Set()).add(fn);
        this.set(key, data);
      }
      return this;
    }

    unsubscribe<TK extends V>(key: TK, fn: TFn) {
      console.log("EE unsubscribe", key, fn);
      

      const data = this.getDraft(key, {} as T[TK]);
      data?.subscribeSet?.delete(fn);
      this.set(key, data);
      return this;
      // this._subscribeSet[key] = this._subscribeSet[key]?.size ? this._subscribeSet[key] : undefined,
    }
  };
};
