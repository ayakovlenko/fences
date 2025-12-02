import { dirname, join, normalize } from "node:path";
import type { Project } from "../config/types.ts";
import { getModuleSourceFilesSync } from "../core/fs/mod.ts";
import type { ParsedFile } from "../parser/mod.ts";
import { parseFile } from "../parser/mod.ts";
import type { Graph } from "./types.ts";

type ImportWithModule = {
  module?: string;
  filepath: string;
};

export function getModuleImports(
  project: Project,
  moduleName: string,
): ({
  path: string;
  imports: ImportWithModule[];
})[] {
  return parseModuleFiles(project, moduleName)
    .map((f) => {
      return {
        path: f.path,
        imports: detectExternalModuleImports(project, f),
      };
    });
}

function parseModuleFiles(project: Project, moduleName: string): ParsedFile[] {
  const files = getModuleSourceFilesSync(project, moduleName);

  return files.map((file) => parseFile(file));
}

function detectExternalModuleImports(
  project: Project,
  parsedFile: ParsedFile,
): ImportWithModule[] {
  const localImports = parsedFile.imports.filter((i) => i.kind === "relative");
  const resolvedPaths = localImports.map(({ value }) =>
    normalize(join(dirname(parsedFile.path), value))
  );
  return resolvedPaths.map((path) => ({
    module: getModuleForImport(project, path),
    filepath: path,
  }));
}

// This function figures out what module a given import belongs to.
function getModuleForImport(
  project: Project,
  importPath: string,
): string | undefined {
  const modules = project.modules.map((m) => m.name);

  // sort `modules` by length in descending order
  modules.sort((a, b) => b.length - a.length);

  // find longest matching module name
  const moduleName = modules.find((m) =>
    importPath.startsWith(join(project.path, m))
  );

  return moduleName;
}

export function validTransitionsGraph(project: Project): Graph {
  const graph: Graph = {};

  for (const module of project.modules) {
    graph[module.name] = {};

    const dependentModuleNames = module.dependsOn || [];
    for (const dependentModuleName of dependentModuleNames) {
      const dependentModule = project.modules.find((m) =>
        m.name === dependentModuleName
      );

      if (!dependentModule) {
        throw new Error(
          `Module "${module.name}" depends on non-existent module "${dependentModuleName}"`,
        );
      }

      const exposedFiles = dependentModule.exposes || [];

      for (const exposedFile of exposedFiles) {
        const filePath = join(
          project.path,
          dependentModule.name,
          exposedFile,
        );

        const paths = graph[module.name];
        if (!paths) {
          throw new Error(`module "${module.name}" not found in graph`);
        }

        paths[filePath] = dependentModule.name;
      }
    }
  }

  return graph;
}
