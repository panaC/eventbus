import {
  eventEmitter,
  IEventEmitter,
  TContainerWithEventEmitter,
} from '../src/decorator/eventEmitter';
import * as assert from 'assert';
import {IPipe, pipe, TContainerWithPipe} from '../src/decorator/pipe';
import {
  ContainerWithImmerAndGlobAccessAndDispatch,
  TContainerWithStore,
} from '../src/Container';

const test = () => {
  {
    interface ITest2 {
      hello?: string;
      world?: number;
    }

    interface MyColonne
      extends ContainerWithImmerAndGlobAccessAndDispatch<
          ITest2,
          TEventEmitter,
          keyof ITest2
        >,
        IEventEmitter<ITest2, keyof ITest2>,
        IPipe<ITest2, keyof ITest2> {}

    type TEventEmitter = TContainerWithEventEmitter<keyof ITest2> &
      TContainerWithPipe<keyof ITest2> &
      TContainerWithStore<ITest2, keyof ITest2>;

    @pipe
    @eventEmitter
    class MyColonne extends ContainerWithImmerAndGlobAccessAndDispatch<
      ITest2,
      TEventEmitter,
      keyof ITest2
    > {}
    const ev = new MyColonne({});

    const fn = (bus: any, data: any) => {
      console.log('HELLO', data);
      assert.deepStrictEqual('world', data);
      assert.deepStrictEqual(bus, ev);
    };
    const fnPipeSub = (bus: any, data: any) => {
      console.log('HELLO', data);
      assert.deepStrictEqual('piped !', data);
      assert.deepStrictEqual(bus, ev);
    };
    const fnPipe = (bus: MyColonne, data: string | undefined) => {
      console.log('PP', data);
      assert.deepStrictEqual(data, 'pipe ?');
      assert.deepStrictEqual(bus, ev);
      return 'piped !';
    };

    ev.subscribe('hello', fn)
      .dispatch('hello', 'world')
      .unsubscribe('hello', fn)
      .dispatch('hello', 'should not subscribe')
      .pipe('hello', fnPipe)
      .subscribe('hello', fnPipeSub)
      .dispatch('hello', 'pipe ?')
      .unpipe('hello', fnPipe)
      .unsubscribe('hello', fnPipeSub)
      .dispatch('hello', 'should not subscribe and pipe');
  }
};

test();
