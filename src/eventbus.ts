export type TFn<
  Key extends keyof Second = any,
  First = any,
  Second = any,
  Ret = any
> = (a: First) => (a: Second[Key]) => Ret;

export type TMaybePromise<V> = V | Promise<V>;

// export interface Eventbus<T, TContext> {
// dispatch: <TK extends keyof T>(key: TK, data: TMaybePromise<T[TK]>) => this;
// subscribe: <TK extends keyof T>(key: TK, fn: TFn<TK, TContext, T>) => this;
// unsubscribe: <TK extends keyof T>(key: TK, fn: TFn) => this;
// }

export class Eventbus<T, TContext> {
  constructor(public _context: TContext) {}

  _subscribeSet: {[key in keyof T]?: Set<TFn>} = {};

  dispatch<TK extends keyof T>(key: TK, data: TMaybePromise<T[TK]>) {
    return (
      Promise.resolve(data).then(v =>
        this._subscribeSet[key]?.forEach(fn => fn(this._context)(v))
      ),
      this
    );
  }

  subscribe<TK extends keyof T>(key: TK, fn: TFn<TK, TContext, T>) {
    return (
      (this._subscribeSet[key] = (this._subscribeSet[key] ?? new Set()).add(
        fn
      )),
      this
    );
  }

  unsubscribe<TK extends keyof T>(key: TK, fn: TFn) {
    return (
      this._subscribeSet[key]?.delete(fn),
      // this._subscribeSet[key] = this._subscribeSet[key]?.size ? this._subscribeSet[key] : undefined,
      this
    );
  }
}
