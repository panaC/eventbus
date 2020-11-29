import {TContainer} from '../Container';
import createSagaMiddleware, {SagaMiddleware} from 'redux-saga';
import {TMaybePromise} from '../type/fn.type';
import {Dispatch} from '../Dispatch';

export interface ISaga {
  runSaga: SagaMiddleware['run'];
}

export const saga = <
  TClass extends {
    new (...a: any[]): Dispatch<T, U, V>;
  },
  T extends TContainer<V>,
  U extends TContainer<V>,
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
      getState: () => this.get,
    });

    runSaga = this._sagaMiddleware.run;

    dispatch<TK extends V>(key: TK, value: TMaybePromise<T[TK]>) {
      this._sagaMiddlewareDispatch(action => {
        super.dispatch(key, value);
        return action;
      })({type: key, value});

      return this;
    }
  };
};
