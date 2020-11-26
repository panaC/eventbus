import {deepStrictEqual} from 'assert';
import {log} from '../src/decorator/log';
import {Eventbus} from '../src/eventbus';

const test = () => {
  {
    interface ITest1 {
      hello: string;
      world: number;
    }
    const context = {test: 123};

    @log(console.log)
    class MyEventBus extends Eventbus<ITest1, typeof context> {}
    const ev = new MyEventBus({test: 123});

    const fn = (ctx: typeof context) => (test: string) => (
      deepStrictEqual(test, 'world'), deepStrictEqual(ctx, context)
    );
    ev.subscribe('hello', fn)
      .dispatch('hello', 'world')
      .unsubscribe('hello', fn)
      .dispatch('hello', 'should not subscribe');
  }
};

test();
