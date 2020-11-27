
/* eslint-disable @typescript-eslint/ban-ts-comment */

export const log = (log: (...a: any[]) => any) => <
  TClass extends {new (...a: any[]): any},
  // T,
  // TContext
>(
  constructor: TClass
) => {
  return class extends constructor {
    constructor(...a: any[]) {
      super(...a);
    }

    dispatch(...a: any[]) {
      log(+new Date(), 'dispatch :', ...a);

      // @ts-ignore
      return super.dispatch(...a);
    }

    unsubscribe(...a: any[]) {
      log(+new Date(), 'unsubscribe :', ...a);

      // @ts-ignore
      return super.unsubscribe(...a);
    }

    subscribe(...a: any[]) {
      log(+new Date(), 'subscribe :', ...a);

      // @ts-ignore
      return super.subscribe(...a);
    }

    pipe(...a: any[]) {
      log(+new Date(), 'pipe :', ...a);

      // @ts-ignore
      return super.pipe(...a);
    }

    unpipe(...a: any[]) {
      log(+new Date(), 'unpipe :', ...a);

      // @ts-ignore
      return super.unpipe(...a);
    }

    once(...a: any[]) {
      log(+new Date(), 'once :', ...a);

      // @ts-ignore
      return super.once(...a);
    }
  };
};
