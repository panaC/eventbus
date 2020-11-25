import {Eventbus, TFn} from '../eventbus';

export interface IOnce<T, TContext, RetEventBus> {
  once: <TK extends keyof T>(key: TK, fn: TFn<TK, TContext, T>) => RetEventBus;
}

export const once = <
  TClass extends {new (...a: any[]): Eventbus<T, TContext>},
  T,
  TContext
>(
  constructor: TClass
) => {
  return class extends constructor {
    constructor(...a: any[]) {
      super(...a);
    }

    public once = <TK extends keyof T>(key: TK, fn: TFn<TK, TContext, T>) => (
      this.subscribe(key, ctx => a =>
        Promise.resolve(fn(ctx)(a)).then(() => this.unsubscribe(key, fn))
      ),
      this
    );
  };
};
