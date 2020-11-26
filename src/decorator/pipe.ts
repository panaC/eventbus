import {Eventbus, TFn, TMaybePromise} from '../eventbus';

export interface IPipe<T, TContext> {
  pipe: <TK extends keyof T>(
    key: TK,
    fn: TFn<TK, TContext, T, TMaybePromise<T[TK]>>
  ) => this;
  unpipe: <TK extends keyof T>(key: TK, fn: TFn) => this;
  dispatch: <TK extends keyof T>(key: TK, data: TMaybePromise<T[TK]>) => this;
}

export const pipe = <
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

    _pipeSet: {
      [key in keyof T]?: Set<TFn<key, TContext, T, TMaybePromise<T[key]>>>;
    } = {};

    dispatch<TK extends keyof T>(key: TK, data: T[TK] | Promise<T[TK]>) {
      return (
        (data = Array.from(
          this._pipeSet[key] ??
            new Set<TFn<TK, TContext, T, TMaybePromise<T[TK]>>>()
        ).reduce(
          (vP, fn) => vP.then(v => Promise.resolve(fn(this._context)(v))),
          Promise.resolve(data)
        )),
        constructor.prototype.dispatch.call(this, key, data),
        this
      );
    }

    pipe<TK extends keyof T>(
      key: TK,
      fn: TFn<TK, TContext, T, TMaybePromise<T[TK]>>
    ) {
      return (
        (this._pipeSet[key] = (this._pipeSet[key] ?? new Set()).add(fn)), this
      );
    }

    unpipe<TK extends keyof T>(key: TK, fn: TFn) {
      return this._pipeSet[key]?.delete(fn), this;
    }
  };
};
