import {
  ContainerWithImmerAndGlobAccessAndDispatch,
  TContainer,
  TContainerWithStore,
} from '../Container';
import createSagaMiddleware, {SagaMiddleware} from 'redux-saga';
import {TMaybePromise} from '../type/fn.type';

export interface ISaga {
  runSaga: SagaMiddleware['run'];
}

export const saga = <
  TClass extends {
    new (...a: any[]): ContainerWithImmerAndGlobAccessAndDispatch<U, T, V>;
  },
  U extends TContainer<V, U[V]>,
  T extends TContainerWithStore<U, V>,
  V extends string
>(
  constructor: TClass
) => {
  return class extends constructor {
    constructor(...a: any[]) {
      super(...a);
    }

    _sagaMiddleware = createSagaMiddleware();

    _sagaMiddlewareDispatch = this._sagaMiddleware({
      dispatch: action => {
        const {type, value: actionValue} = action;
        this.dispatch(type as V, actionValue);
        return action;
      },
      getState: () => <K extends V>(key: K) => this.get(key)?.data,
    });

    runSaga = this._sagaMiddleware.run;

    dispatch<TK extends V>(key: TK, value: TMaybePromise<U[TK]>) {
      this._sagaMiddlewareDispatch(action => {
        super.dispatch(key, value);
        return action;
      })({type: key, value});

      return this;
    }
  };
};
