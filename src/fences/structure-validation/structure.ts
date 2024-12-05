import type { Project } from "../config/types.ts";
import type { ParsedFile } from "../parser/mod.ts";
import { extractImportsFromFile } from "../parser/mod.ts";
import { path, walkSync } from "./deps.ts";
import type { Graph } from "./types.ts";

type ImportWithModule = {
  module?: string;
  filepath: string;
};

function getModuleImports(
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
  const files = getModuleSourceFiles(project, moduleName);
  return files.map((file) => extractImportsFromFile(file));
}

// TODO: find a better name for this function because it's shit
function detectExternalModuleImports(
  project: Project,
  parsedFile: ParsedFile,
): ImportWithModule[] {
  const { dirname, join, normalize } = path;
  const localImports = parsedFile.imports.filter((i) =>
    i.type === "LocalImport"
  );
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
    importPath.startsWith(path.join(project.path, m))
  );

  return moduleName;
}

function validTransitionsGraph(project: Project): Graph {
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
        const filePath = path.join(
          project.path,
          dependentModule.name,
          exposedFile,
        );

        graph[module.name][filePath] = dependentModule.name;
      }
    }
  }

  return graph;
}

function getModuleSourceFiles(project: Project, moduleName: string): string[] {
  const basePath = project.path;

  // find module
  const module = project.modules.find((p) => p.name === moduleName)!;

  const modulePath = path.join(basePath, module.name);

  const walking = walkSync(modulePath, {
    includeDirs: false,
    exts: [
      "ts",
      "tsx",
    ],
  });

  const sources: string[] = [];
  for (const file of walking) {
    sources.push(file.path);
  }
  return sources;
}

export { getModuleImports, validTransitionsGraph };
