// import { type ExportSpecifier } from "@swc/core";
import {
  type ExportNamedDeclaration,
  type ImportDeclaration,
  parseSync,
  type Program,
} from "@swc/wasm";
import {
  type Export,
  type Import,
  type ImportType,
  ParsedFile,
} from "./types.ts";

// FIXME! Also include exports
export function extractImports(source: string): Import[] {
  const ast = getAst(source);

  const imports = ast.body.filter((node: HasType): node is ImportDeclaration =>
    node.type === "ImportDeclaration"
  ) as ImportDeclaration[];

  return imports.map((x) => {
    const value = x.source.value;
    const type = determineImportType(value);

    return {
      type,
      value,
    };
  });
}

function extractExports(source: string): Export[] {
  const ast = getAst(source);

  const exports = ast.body.filter((
    node: HasType,
  ): node is ExportNamedDeclaration =>
    node.type === "ExportNamedDeclaration"
  ) as ExportNamedDeclaration[];

  return exports.filter((node) => !!node.source).map((x) => {
    const value = x.source!.value;
    const type = determineImportType(value);

    return {
      type,
      value,
    };
  });
}

type HasType = { type: string };

export function parseFile(path: string): ParsedFile {
  const source = Deno.readTextFileSync(path);
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

function determineImportType(value: string): ImportType {
  if (value.startsWith(".")) {
    return "LocalImport";
  }
  return "RemoteImport";
}
