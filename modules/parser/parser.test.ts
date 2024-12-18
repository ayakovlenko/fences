import { describe, it } from "@std/testing/bdd";
import { extractImports } from "./parser.ts";
import { expect } from "@std/expect/expect";

describe("extractImports", () => {
  it("must extract local and remote imports", () => {
    const source = `
        import { foo } from "./foo.ts";
        import bar from "@std/bar";
        import * as baz from 'https://foo.com/baz.js';
    `;

    const have = extractImports(source);

    const want = [
      {
        type: "LocalImport",
        value: "./foo.ts",
      },
      {
        type: "RemoteImport",
        value: "@std/bar",
      },
      {
        type: "RemoteImport",
        value: "https://foo.com/baz.js",
      },
    ];

    expect(have).toEqual(want);
  });
});
