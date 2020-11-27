export type TFn<Bus = any, TData = any, Ret = any> = (
  bus: Bus,
  data: TData
) => Ret;

export type TMaybePromise<V> = V | Promise<V>;
