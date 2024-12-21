import { expect } from "@std/expect/expect";
import { describe, it } from "@std/testing/bdd";
import { Specifier } from "../core/types/mod.ts";
import { extractImports } from "./parser.ts";

describe("extractImports", () => {
  it("must extract local and remote imports", () => {
    const source = `
        import { foo } from "./foo.ts";
        import bar from "@std/bar";
        import * as baz from 'https://foo.com/baz.js';
        import config from 'file:///opt/nodejs/config.js';
    `;

    const have: Specifier[] = extractImports(source);

    const want: Specifier[] = [
      {
        kind: "relative",
        value: "./foo.ts",
      },
      {
        kind: "bare",
        value: "@std/bar",
      },
      {
        kind: "absolute",
        value: "https://foo.com/baz.js",
      },
      {
        kind: "absolute",
        value: "file:///opt/nodejs/config.js",
      },
    ];

    expect(have).toEqual(want);
  });
});
