import * as micromatch from 'micromatch';
import {createDraft, Draft, finishDraft, isDraft} from 'immer';
import {Objectish} from 'immer/dist/internal';

export type TContainer<V extends string, R extends Objectish> = {
  [key in V]?: R;
};

export abstract class ContainerAbstract<
  T extends TContainer<V, T[V]>,
  V extends string
> {
  constructor(public _container: TContainer<V, T[V]> = {}) {}
}

export class Container<
  T extends TContainer<V, T[V]>,
  V extends string
> extends ContainerAbstract<T, V> {
  constructor(_container: T) {
    super(_container);
  }

  _containerKeyArray: string[] = [];

  set<K extends V>(key: K, data: T[K]) {
    if (typeof key === 'string') {
      this._containerKeyArray.push(key);
    }
    if (this._container[key] !== data) {
      const dataNotNull = data ? data : undefined;
      const newData =
        typeof dataNotNull === 'object' ? {...dataNotNull} : dataNotNull;
      this._container[key] = newData;
    }
  }

  delete<K extends V>(key: K) {
    delete this._container[key];
    const index = this._containerKeyArray.findIndex(v => v === key);
    if (index > -1) {
      this._containerKeyArray = [
        ...this._containerKeyArray.slice(0, index),
        ...this._containerKeyArray.slice(index, this._containerKeyArray.length),
      ];
    }
  }

  get<K extends V>(key: K) {
    const data = this._container[key];
    return data ? Object.seal(data as T[K]) : undefined;
  }
}

export class ContainerWithImmer<
  T extends TContainer<V, T[V]>,
  V extends string
> extends Container<T, V> {
  constructor(_container: T) {
    super(_container);
  }

  set<K extends V>(key: K, data: Draft<T[K]> | T[K]) {
    if (isDraft(data)) {
      this.set(key, finishDraft(data));
    } else {
      super.set(key, data as T[K]);
    }
  }

  getDraft<K extends V>(key: K): Draft<T[K]> | undefined {
    const data = this.get<K>(key);
    const draftDataOrUndefined = data ? createDraft(data as T[K]) : undefined;
    return draftDataOrUndefined;
  }
}

export class ContainerWithImmerAndGlobAccess<
  T extends TContainer<V, T[V]>,
  V extends string
> extends ContainerWithImmer<T, V> {
  constructor(_container: T) {
    super(_container);
  }

  _getKeys<K extends V>(key: string): Array<K> {
    const keys = micromatch(this._containerKeyArray, key) as Array<K>;
    return keys;
  }

  getGlob<K extends V>(key: string): TContainer<V, T[V]> {
    const keys = this._getKeys<K>(key);
    const ret: TContainer<V, T[V]> = {};
    keys.forEach(k => (ret[k] = this.get(k)));
    return ret;
  }

  getGlobDraft<K extends V>(key: string): TContainer<V, Draft<T[V]>> {
    const keys = this._getKeys<K>(key);
    const ret: TContainer<V, Draft<T[V]>> = {};
    keys.forEach(k => (ret[k] = this.getDraft(k)));
    return ret;
  }
}
