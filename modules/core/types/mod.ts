/**
 * The specifier of an import or an export statement is the string after the `from` keyword,
 * e.g. `'node:path'` in `import { sep } from 'node:path'`.
 */
export type Specifier = {
  value: string;
  kind: SpecifierType;
};

export type SpecifierType =
  | "relative" // e.g. './startup.js' or '../config.mjs'
  | "bare" // e.g. 'some-package' or 'some-package/shuffle'
  | "absolute"; // e.g. 'file:///opt/nodejs/config.js'
