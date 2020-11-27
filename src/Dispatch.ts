import {ContainerWithImmerAndGlobAccess, TContainer} from './Container';
import {TMaybePromise} from './type/fn.type';

export abstract class Dispatch<
  T extends TContainer<V, T[V]>,
  V extends string
> extends ContainerWithImmerAndGlobAccess<T, V> {
  dispatch<TK extends V>(_key: TK, _data: TMaybePromise<T[TK]>) {}
}
