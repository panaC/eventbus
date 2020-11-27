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

  set<TK extends keyof T>(key: TK, data: Draft<T[TK]> | T[TK]) {
    if (isDraft(data)) {
      this._container[key] = finishDraft(data);
    } else {
      if (typeof key === "string") {
        this._containerKeyArray.push(key);
      }
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

  get<TK extends keyof T>(key: TK): Draft<T[TK]> | undefined {
    const data = this._container[key];
    return data ? createDraft(data as T[TK]) : undefined;
  }

}

export class ContainerWithGlobAccess<T extends TContainer> extends Container<T> {
  constructor(_container: T) { super(_container); }

  getGlob<K extends keyof T>(key: string): {[key in K]?: Draft<T[K]>} {
    const keys = micromatch(this._containerKeyArray, key) as Array<K>
    const ret: {[key in K]?: Draft<T[K]>} = {};
    keys.forEach((k) => ret[k] = this.get(k));
    return ret;
  }
}