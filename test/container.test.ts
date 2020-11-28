import * as assert from 'assert';
import {
  Container,
  ContainerWithImmer,
  ContainerWithImmerAndGlobAccess,
} from '../src/Container';

const test1 = () => {
  interface ITest {
    hello?: string;
    world?: string;
  }
  const test: ITest = {};

  {
    const c = new Container<ITest, keyof ITest>(test);
    {
      c.set('hello', 'world');
      c.set('world', 'hello');

      const v1 = c.get('hello');
      const v2 = c.get('world');

      assert.deepStrictEqual(v1, 'world');
      assert.deepStrictEqual(v2, 'hello');

      c.delete('world');

      const v3 = c.get('hello');
      const v4 = c.get('world');

      assert.deepStrictEqual(v3, 'world');
      assert.deepStrictEqual(v4, undefined);

      c.delete('hello');

      const v5 = c.get('hello');
      const v6 = c.get('world');

      assert.deepStrictEqual(v5, undefined);
      assert.deepStrictEqual(v6, undefined);
    }
    {
      c.set('hello', 'world');
      c.set('world', 'hello');

      const v1 = c.get('hello');
      const v2 = c.get('world');

      assert.deepStrictEqual(v1, 'world');
      assert.deepStrictEqual(v2, 'hello');

      c.delete('world');

      const v3 = c.get('hello');
      const v4 = c.get('world');

      assert.deepStrictEqual(v3, 'world');
      assert.deepStrictEqual(v4, undefined);

      c.delete('hello');

      const v5 = c.get('hello');
      const v6 = c.get('world');

      assert.deepStrictEqual(v5, undefined);
      assert.deepStrictEqual(v6, undefined);
    }
  }
};

test1();

const test2 = () => {
  interface ITest {
    hello?: string;
    world?: string;
  }
  const test: ITest = {};

  {
    const c = new ContainerWithImmer<ITest, keyof ITest>(test);
    {
      c.set('hello', 'world');
      c.set('world', 'hello');

      const v1 = c.get('hello');
      const v2 = c.get('world');

      assert.deepStrictEqual(v1, 'world');
      assert.deepStrictEqual(v2, 'hello');

      c.delete('world');

      const v3 = c.get('hello');
      const v4 = c.get('world');

      assert.deepStrictEqual(v3, 'world');
      assert.deepStrictEqual(v4, undefined);

      c.delete('hello');

      const v5 = c.get('hello');
      const v6 = c.get('world');

      assert.deepStrictEqual(v5, undefined);
      assert.deepStrictEqual(v6, undefined);
    }
    {
      c.set('hello', 'world');
      c.set('world', 'hello');

      const v1 = c.get('hello');
      const v2 = c.get('world');

      assert.deepStrictEqual(v1, 'world');
      assert.deepStrictEqual(v2, 'hello');

      c.delete('world');

      const v3 = c.get('hello');
      const v4 = c.get('world');

      assert.deepStrictEqual(v3, 'world');
      assert.deepStrictEqual(v4, undefined);

      c.delete('hello');

      const v5 = c.get('hello');
      const v6 = c.get('world');

      assert.deepStrictEqual(v5, undefined);
      assert.deepStrictEqual(v6, undefined);
    }
  }
};

test2();

const test3 = () => {
  interface ITest {
    hello?: {test: string};
    world?: {test: string};
  }
  const test: ITest = {};

  {
    const c = new ContainerWithImmer<ITest, keyof ITest>(test);
    {
      c.set('hello', {test: 'world'});
      c.set('world', {test: 'hello'});

      const v1 = c.getDraft('hello', {test: ''});
      const v2 = c.getDraft('world', {test: ''});

      if (v1) {
        v1.test = 'immer';
      }
      if (v2) {
        v2.test = 'remmi';
      }

      assert.deepStrictEqual(v1?.test, 'immer');
      assert.deepStrictEqual(v2?.test, 'remmi');

      c.set('hello', v1);
      c.set('world', v2);

      const v31 = c.get('hello')?.test;
      const v41 = c.get('world')?.test;

      assert.deepStrictEqual(v31, 'immer');
      assert.deepStrictEqual(v41, 'remmi');

      c.delete('world');

      const v3 = c.get('hello')?.test;
      const v4 = c.get('world')?.test;

      assert.deepStrictEqual(v3, 'immer');
      assert.deepStrictEqual(v4, undefined);

      c.delete('hello');

      const v5 = c.get('hello')?.test;
      const v6 = c.get('world')?.test;

      assert.deepStrictEqual(v5, undefined);
      assert.deepStrictEqual(v6, undefined);
    }
    {
      c.set('hello', {test: 'world'});
      c.set('world', {test: 'hello'});

      const v1 = c.getDraft('hello', {test: ''});
      const v2 = c.getDraft('world', {test: ''});

      if (v1) {
        v1.test = 'immer';
      }
      if (v2) {
        v2.test = 'remmi';
      }

      assert.deepStrictEqual(v1?.test, 'immer');
      assert.deepStrictEqual(v2?.test, 'remmi');

      c.set('hello', v1);
      c.set('world', v2);

      const v31 = c.get('hello')?.test;
      const v41 = c.get('world')?.test;

      assert.deepStrictEqual(v31, 'immer');
      assert.deepStrictEqual(v41, 'remmi');

      c.delete('world');

      const v3 = c.get('hello')?.test;
      const v4 = c.get('world')?.test;

      assert.deepStrictEqual(v3, 'immer');
      assert.deepStrictEqual(v4, undefined);

      c.delete('hello');

      const v5 = c.get('hello')?.test;
      const v6 = c.get('world')?.test;

      assert.deepStrictEqual(v5, undefined);
      assert.deepStrictEqual(v6, undefined);
    }
  }
};

test3();

const test4 = () => {
  interface ITest {
    hello?: {test: string};
    world?: {test: string};
    'hello/glob'?: string;
  }
  const test: ITest = {};

  {
    const c = new ContainerWithImmerAndGlobAccess<ITest, keyof ITest>(test);
    {
      c.set('hello', {test: 'world'});
      c.set('world', {test: 'hello'});
      c.set('hello/glob', 'hello world !');

      const v1 = c.getDraft('hello', {test: ''});
      const v2 = c.getDraft('world', {test: ''});

      if (v1) {
        v1.test = 'immer';
      }
      if (v2) {
        v2.test = 'remmi';
      }

      assert.deepStrictEqual(v1?.test, 'immer');
      assert.deepStrictEqual(v2?.test, 'remmi');

      c.set('hello', v1);
      c.set('world', v2);

      const v31 = c.get('hello')?.test;
      const v41 = c.get('world')?.test;

      assert.deepStrictEqual(v31, 'immer');
      assert.deepStrictEqual(v41, 'remmi');

      c.delete('world');

      const v3 = c.get('hello')?.test;
      const v4 = c.get('world')?.test;

      assert.deepStrictEqual(v3, 'immer');
      assert.deepStrictEqual(v4, undefined);

      c.delete('hello');

      const v5 = c.get('hello')?.test;
      const v6 = c.get('world')?.test;

      assert.deepStrictEqual(v5, undefined);
      assert.deepStrictEqual(v6, undefined);
    }
    {
      const res = c.getGlob('hello*');
      assert.deepStrictEqual(res, {hello: undefined});
    }
    {
      const res = c.getGlob('**');
      assert.deepStrictEqual(res, {
        hello: undefined,
        world: undefined,
        'hello/glob': 'hello world !',
      });
    }
    {
      const res = c.getGlob('*');
      assert.deepStrictEqual(res, {hello: undefined, world: undefined});
    }
  }
};

test4();
