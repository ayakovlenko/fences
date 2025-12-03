// import { type ExportSpecifier } from "@swc/core";

import { readFileSync } from "node:fs";
import {
  type ExportNamedDeclaration,
  type ImportDeclaration,
  type Program,
  parseSync,
} from "@swc/wasm";
import type { Specifier, SpecifierType } from "../core/types/mod.ts";
import type { ParsedFile } from "./types.ts";

// FIXME! Also include exports
export function extractImports(source: string): Specifier[] {
  const ast = getAst(source);

  const imports = ast.body.filter((node: HasType): node is ImportDeclaration =>
    node.type === "ImportDeclaration"
  ) as ImportDeclaration[];

  return imports.map((x) => {
    const value = x.source.value;
    const kind = determineSpecifierType(value);

    return {
      kind,
      value,
    };
  });
}

function extractExports(source: string): Specifier[] {
  const ast = getAst(source);

  const exports = ast.body.filter((
    node: HasType,
  ): node is ExportNamedDeclaration =>
    node.type === "ExportNamedDeclaration"
  ) as ExportNamedDeclaration[];

  return exports.filter((node) => !!node.source).map((x) => {
    const value = x.source!.value;
    const kind = determineSpecifierType(value);

    return {
      kind,
      value,
    };
  });
}

type HasType = { type: string };

export function parseFile(path: string): ParsedFile {
  const source = readFileSync(path, "utf-8");

  return {
    path,
    imports: extractImports(source),
    exports: extractExports(source),
  };
}

function getAst(source: string): Program {
  return parseSync(source, {
    target: "es2022",
    syntax: "typescript",
    tsx: true,
  });
}

function determineSpecifierType(value: string): SpecifierType {
  if (value.startsWith(".")) {
    return "relative";
  }

  if (stringIsAValidUrl(value)) {
    return "absolute";
  }

  return "bare";
}

function stringIsAValidUrl(s: string): boolean {
  try {
    const { protocol } = new URL(s);

    return (
      protocol === "https:" ||
      protocol === "file:" ||
      protocol === "http:"
    );
  } catch (_) {
    return false;
  }
}
