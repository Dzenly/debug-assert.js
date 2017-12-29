// Type definitions for [~THE LIBRARY NAME~] [~OPTIONAL VERSION NUMBER~]
// Project: [~THE PROJECT NAME~]
// Definitions by: [~YOUR NAME~] <[~A URL FOR YOU~]>

declare namespace DebugAssertJs {

  interface Common {
    true(expr: any, msg: string) : void;
    ip(expr: any, msg: string) : void;
    eq(expr1: any, expr2: any, msg: string) : void;
  }

  interface NonCond extends Common {
    setLogger(logger: Object): void;
    cond: Common;
  }
}

declare const debugAssert: DebugAssertJs.NonCond;

declare module "debug-assert" {
  export = debugAssert;
}
