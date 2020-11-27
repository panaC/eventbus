export type TFn<
  Bus = any,
  Key extends keyof Obj = any,
  Obj = any,
  Ret = any
> = (bus: Bus, data: Obj[Key]) => Ret;

export type TMaybePromise<V> = V | Promise<V>;
