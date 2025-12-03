import type { Module, Project } from "../config/types.ts";
import { getModuleSourceFiles } from "../core/fs/mod.ts";
import { parseFile } from "../parser/mod.ts";

export async function checkLibraries(project: Project): Promise<string[]> {
  const errors: string[] = [];

  for (const module of project.modules) {
    // deno-lint-ignore no-await-in-loop
    const moduleFiles = await getModuleSourceFiles(project, module.name);

    for (const file of moduleFiles) {
      const { imports, exports } = parseFile(file);

      const remoteImports = imports.filter((i) => i.kind !== "relative");

      const remoteExports = exports.filter((i) => i.kind !== "relative");

      for (const { value } of [...remoteImports, ...remoteExports]) {
        if (!isLibraryAllowed(module, value)) {
          errors.push(`in ${file}: ${value} is not allowed`);
        }
      }
    }
  }

  return errors;
}

function isLibraryAllowed(module: Module, library: string): boolean {
  if (!module.libraries) {
    return false;
  }

  for (const allowedLibrary of module.libraries) {
    if (library.startsWith(allowedLibrary)) {
      return true;
    }
  }

  return false;
}
