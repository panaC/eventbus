export type TEventFn<Par = any, Ret = any> = (a: Par) => Ret;

export type TFn<
  Key extends keyof Second = any,
  First = any,
  Second = any,
  Ret = any
> = (a: First) => TEventFn<Second[Key], Ret>;

export class Eventbus<T, TContext> {
  constructor(protected context: TContext) {}

  protected subscribeSet: {[key: string]: Set<TFn>} = {};

  public dispatch = <TK extends keyof T>(key: TK, data: T[TK]) => (
    this.subscribeSet[key as string]?.forEach(fn => fn(this.context)(data)),
    this
  );

  public subscribe = <TK extends keyof T>(
    key: TK,
    fn: TFn<TK, TContext, T>
  ) => (
    (this.subscribeSet[key as string] = (
      this.subscribeSet[key as string] || new Set()
    ).add(fn)),
    this
  );

  public unsubscribe = <TK extends keyof T>(key: TK, fn: TFn) => (
    this.subscribeSet[key as string]?.delete(fn), this
  );
}
