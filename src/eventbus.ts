export type TEventFn<Par = any, Ret = any> = (a: Par) => Ret;

export type TFn<
  Key extends keyof Second = any,
  First = any,
  Second = any,
  Ret = any
> = (a: First) => TEventFn<Second[Key], Ret>;

export interface Eventbus<T, TContext> {
  dispatch: <TK extends keyof T>(key: TK, data: T[TK]) => this;
  subscribe: <TK extends keyof T>(key: TK, fn: TFn<TK, TContext, T>) => this;
  unsubscribe: <TK extends keyof T>(key: TK, fn: TFn) => this;
}

export class Eventbus<T, TContext> {
  constructor(public _context: TContext) {}

  _subscribeSet: {[key: string]: Set<TFn>} = {};

  public dispatch = <TK extends keyof T>(key: TK, data: T[TK]) => (
    this._subscribeSet[key as string]?.forEach(fn => fn(this._context)(data)),
    this
  );

  public subscribe = <TK extends keyof T>(
    key: TK,
    fn: TFn<TK, TContext, T>
  ) => (
    (this._subscribeSet[key as string] = (
      this._subscribeSet[key as string] || new Set()
    ).add(fn)),
    this
  );

  public unsubscribe = <TK extends keyof T>(key: TK, fn: TFn) => (
    this._subscribeSet[key as string]?.delete(fn), this
  );
}
