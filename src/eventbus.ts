export type TEventFn<Par = any, Ret = any> = (a: Par) => Ret;

export type TFn<
  Key extends keyof Second = any,
  First = any,
  Second = any,
  Ret = any
> = (a: First) => TEventFn<Second[Key], Ret>;

export class Eventbus<T, TContext> {
  constructor(public _context: TContext) {}

  // no abble to be protected
  // https://stackoverflow.com/questions/55242196/typescript-allows-to-use-proper-multiple-inheritance-with-mixins-but-fails-to-c#:~:text=exported%20anonymous%20classes%20can't,or%20protected%20hence%20the%20error.

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
