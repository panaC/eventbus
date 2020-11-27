import * as micromatch from "micromatch";
import { createDraft, Draft, finishDraft, isDraft } from "immer"
import { Objectish } from "immer/dist/internal";

export type TContainer = { [key: string]: Objectish };

export abstract class ContainerAbstract<T extends TContainer> {
  constructor(public _container: {[key in keyof T]?: T[key]} = {}) {}
}

export class Container<T extends TContainer> extends ContainerAbstract<T> {
  constructor(_container: T) { super(_container); }

  _containerKeyArray: string[] = [];

  set<TK extends keyof T>(key: TK, data: T[TK]) {
    if (typeof key === "string") {
      this._containerKeyArray.push(key);
    }
    if (this._container[key] !== data) {
      this._container[key] = Object.assign(data);
    }
  }

  delete<TK extends keyof T>(key: TK) {
    delete this._container[key];
    const index = this._containerKeyArray.findIndex((v) => v === key);
    if (index > -1) {
      this._containerKeyArray = [
        ...this._containerKeyArray.slice(0, index),
        ...this._containerKeyArray.slice(index, this._containerKeyArray.length),
      ];
    }
  }

  get<TK extends keyof T>(key: TK) {
    const data = this._container[key];
    return data ? Object.seal(data as T[TK]) : undefined;
  }
}

export class ContainerWithImmer<T extends TContainer> extends Container<T> {
  constructor(_container: T) { super(_container); }

  set<TK extends keyof T>(key: TK, data: Draft<T[TK]> | T[TK]) {
    if (isDraft(data)) {
      this.set(key, finishDraft(data));
    } else {
      super.set(key, data as T[TK]);
    }
  }

  getDraft<TK extends keyof T>(key: TK): Draft<T[TK]> | undefined {
    const data = this.get(key);
    return data ? createDraft(data as T[TK]) : undefined;
  }
}

export class ContainerWithImmerAndGlobAccess<T extends TContainer> extends ContainerWithImmer<T> {
  constructor(_container: T) { super(_container); }

  _getKeys<TK extends keyof T>(key: string): Array<TK> {
    const keys = micromatch(this._containerKeyArray, key) as Array<TK>;
    return keys;
  }

  getGlob<TK extends keyof T>(key: string): {[key in TK]?: T[TK]} {
    const keys = this._getKeys<TK>(key);
    const ret: {[key in TK]?: T[TK]} = {};
    keys.forEach((k) => ret[k] = this.get(k));
    return ret;
  }

  getGlobDraft<TK extends keyof T>(key: string): {[key in TK]?: Draft<T[TK]>} {
    const keys = this._getKeys<TK>(key);
    const ret: { [key in TK]?: Draft<T[TK]> } = {};
    keys.forEach((k) => ret[k] = this.getDraft(k));
    return ret;
  }
}
