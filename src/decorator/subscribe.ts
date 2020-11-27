import { threadId } from 'worker_threads';
import {Container, TContainer} from '../Container';
import { TFn } from '../type/fn.type';

export interface IDataSubscribe<T extends TContainer, key extends keyof T> {
    subscribeSet?: Set<TFn<Container<T>, key, T>>;
}
export type TContainerWithSubscribe<T extends TContainer> = {
  [key in keyof T]: IDataSubscribe<T, key>;
}

export const subscribe = <
  TClass extends { new(...a: any[]): Container<TContainerWithSubscribe<T>> },
  T extends {[key: string]: any},
>(
  constructor: TClass
) => {
  return class extends constructor {
    constructor(...a: any[]) {
      super(...a);
    }

    subscribe<TK extends keyof T>(key: TK, fn: TFn<Container<T>, TK, T>) {

      const data = this.get(key) ?? {} as IDataSubscribe<T, TK>;
      data.subscribeSet = (data.subscribeSet ?? new Set()).add(fn);
      return this;
    }

    unsubscribe<TK extends keyof T>(key: TK, fn: TFn) {
      
      const data = this.get(key);
      data?.subscribeSet?.delete(fn);
      return this;
        // this._subscribeSet[key] = this._subscribeSet[key]?.size ? this._subscribeSet[key] : undefined,
    }
  };
};
