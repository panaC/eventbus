import * as assert from "assert";
import { Container } from "../src/Container";

const test = () => {
    interface ITest {
        hello?: string,
        world?: string,
    };
    const test: ITest = {};

    {
        const c = new Container<ITest, keyof ITest>(test);
        {

            c.set("hello", "world");
            c.set("world", "hello");

            const v1 = c.get("hello");
            const v2 = c.get("world");

            assert.deepStrictEqual(v1, "world");
            assert.deepStrictEqual(v2, "hello");

            c.delete("world");

            const v3 = c.get("hello");
            const v4 = c.get("world");

            assert.deepStrictEqual(v3, "world");
            assert.deepStrictEqual(v4, undefined);

            c.delete("hello");

            const v5 = c.get("hello");
            const v6 = c.get("world");

            assert.deepStrictEqual(v5, undefined);
            assert.deepStrictEqual(v6, undefined);

        }
        {
            c.set("hello", "world");
            c.set("world", "hello");

            const v1 = c.get("hello");
            const v2 = c.get("world");

            assert.deepStrictEqual(v1, "world");
            assert.deepStrictEqual(v2, "hello");

            c.delete("world");

            const v3 = c.get("hello");
            const v4 = c.get("world");

            assert.deepStrictEqual(v3, "world");
            assert.deepStrictEqual(v4, undefined);

            c.delete("hello");

            const v5 = c.get("hello");
            const v6 = c.get("world");

            assert.deepStrictEqual(v5, undefined);
            assert.deepStrictEqual(v6, undefined);

        }

    }
}

test();