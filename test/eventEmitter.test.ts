import { Dispatch } from '../src/Dispatch';
import { eventEmitter, IEventEmitter, TContainerWithEventEmitter } from '../src/decorator/eventEmitter';
import * as assert from 'assert';

const test = () => {
  {
    interface ITest2 {
        hello?: string;
        world?: number;
      }

    interface MyColonne extends Dispatch<ITest2, TEventEmitter, keyof ITest2>, 
        IEventEmitter<ITest2, keyof ITest2> {}

    type TEventEmitter = TContainerWithEventEmitter<keyof ITest2>;
    
    @eventEmitter
    class MyColonne extends Dispatch<ITest2, TEventEmitter, keyof ITest2> {};
    const ev = new MyColonne({});

    const fn = (bus: any, data: any) => {
      console.log("HELLO", data);
      assert.deepStrictEqual("world", data);
      assert.deepStrictEqual(bus, ev);
    }

    ev.subscribe("hello", fn).dispatch("hello", "world")
      .unsubscribe("hello", fn).dispatch("hello", "should not subscribe");
  }
};

test();
