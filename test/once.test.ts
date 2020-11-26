import {deepStrictEqual, doesNotThrow} from 'assert';
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
    const q1 = ev.once('hello', fn);
    const q2 = q1.dispatch('hello', 'world');
    const q3 = q2.dispatch('hello', 'should not subscribe');

    deepStrictEqual(q1, q2);
    deepStrictEqual(q2, q3);
    deepStrictEqual(q3, q1);

    doesNotThrow(() => q1 === q3, 'q1 != q3');

    deepStrictEqual(q1._subscribeSet['hello'], new Set());
  }
};

test();
