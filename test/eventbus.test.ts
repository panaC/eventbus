// import {deepStrictEqual} from 'assert';
// import {Eventbus} from '../src/Container';

// const test = () => {
//   {
//     interface ITest1 {
//       hello: string;
//       world: number;
//     }
//     const context = {test: 123};
//     const ev = new Eventbus<ITest1, typeof context>({test: 123});

//     const fn = (ctx: typeof context) => (test: string) => (
//       deepStrictEqual(test, 'world'), deepStrictEqual(ctx, context)
//     );
//     ev.subscribe('hello', fn)
//       .dispatch('hello', 'world')
//       .unsubscribe('hello', fn)
//       .dispatch('hello', 'should not subscribe');
//   }
// };

// test();
