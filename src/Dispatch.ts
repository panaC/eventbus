import { ContainerAbstract, TContainer } from "./Container";
import { TMaybePromise } from "./type/fn.type";

export abstract class Dispatch<T extends TContainer> extends ContainerAbstract<T> {

    dispatch<TK extends keyof T>(_key: TK, _data: TMaybePromise<T[TK]>) {}
}