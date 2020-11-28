import {ContainerWithImmerAndGlobAccess, TContainer} from './Container';
import {TMaybePromise} from './type/fn.type';

export abstract class Dispatch<
  U extends TContainer<V, U[V]>,
  T extends TContainer<V, T[V]>,
  V extends string
> extends ContainerWithImmerAndGlobAccess<T, V> {
  dispatch<TK extends V>(_key: TK, _data: TMaybePromise<U[TK]>) {
    return this;
  }
}
