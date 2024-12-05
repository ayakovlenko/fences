import { type ImportDeclaration, parse, type Program } from "./deps.ts";
import { type Import, type ImportType, ParsedFile } from "./types.ts";

function extractImports(source: string): Import[] {
  const ast = getAst(source);

  const imports = ast.body.filter(isImportDeclaration) as ImportDeclaration[];

  return imports.map((x) => {
    const value = x.source.value;
    const type = determineImportType(value);

    return {
      type,
      value,
    };
  });
}

function isImportDeclaration(x: { type: string }): x is ImportDeclaration {
  return x.type === "ImportDeclaration";
}

function extractImportsFromFile(path: string): ParsedFile {
  const source = Deno.readTextFileSync(path);
  return {
    path,
    imports: extractImports(source),
  };
}

function getAst(source: string): Program {
  return parse(source, {
    target: "es2021",
    syntax: "typescript",
    tsx: true,
  });
}

function determineImportType(value: string): ImportType {
  if (isValidHttpUrl(value)) {
    return "RemoteImport";
  }
  return "LocalImport";
}

// https://stackoverflow.com/a/43467144
function isValidHttpUrl(s: string): boolean {
  try {
    const url = new URL(s);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

export { extractImports, extractImportsFromFile };
