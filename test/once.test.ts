import {deepStrictEqual} from 'assert';
import {Eventbus} from '../src/eventbus';
import {IOnce, once} from '../src/decorator/once';

const test = () => {
  {
    interface ITest1 {
      hello: string;
      world: number;
    }
    const context = {test: 123};

    interface MyEventBus
      extends Eventbus<ITest1, typeof context>,
        IOnce<ITest1, typeof context, MyEventBus> {}
    @once
    class MyEventBus extends Eventbus<ITest1, typeof context> {}
    const ev = new MyEventBus(context);

    const fn = (ctx: typeof context) => (test: string) => (
      deepStrictEqual(test, 'world'), deepStrictEqual(ctx, context)
    );
    ev.once('hello', fn)
      .dispatch('hello', 'world')
      .dispatch('hello', 'should not subscribe');
  }
};

test();
