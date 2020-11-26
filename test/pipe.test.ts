import {deepStrictEqual} from 'assert';

import {IPipe, pipe} from '../src/decorator/pipe';
import {Eventbus} from '../src/eventbus';

const test = () => {
  {
    interface ITest1 {
      hello: string;
      world: number;
    }
    const context = {test: 123};

    interface MyEventBus
      extends Eventbus<ITest1, typeof context>,
        IPipe<ITest1, typeof context> {}

    @pipe
    class MyEventBus extends Eventbus<ITest1, typeof context> {}
    const ev = new MyEventBus(context);
    // const ev = new Pipe<ITest1, typeof context>(context);

    ev.pipe('hello', ctx => test => (
      deepStrictEqual(test, 'world'),
      deepStrictEqual(ctx, context),
      (test = 'piped'),
      test
    ))
      .pipe('hello', ctx => async test => (
        deepStrictEqual(test, 'piped'),
        deepStrictEqual(ctx, context),
        await new Promise<void>(res => setTimeout(() => res(), 500)),
        (test = 'awaited'),
        test
      ))
      .subscribe('hello', ctx => test => (
        deepStrictEqual(test, 'awaited'), deepStrictEqual(ctx, context)
      ))
      .dispatch('hello', 'world');
  }
};

test();
