import type { Project } from "../config/types.ts";
import { getModuleImports, validTransitionsGraph } from "./structure.ts";

export function findIllegalImports(project: Project): string[] {
  const errors: string[] = [];

  const validTransitions = validTransitionsGraph(project);

  for (const module of project.modules) {
    const moduleImports = getModuleImports(project, module.name);

    for (const moduleImport of moduleImports) {
      const { path: filePath, imports: fileImports } = moduleImport;

      for (const fileImport of fileImports) {
        const actualModule = fileImport.module;

        if (actualModule === module.name) {
          continue;
        }

        const transition = validTransitions[module.name];
        if (!transition) {
          errors.push(
            `in ${filePath}: illegal import from ${actualModule}`,
          );
          continue;
        }

        const expectedModule =
          transition[fileImport.filepath];

        if (!expectedModule) {
          errors.push(
            `in ${filePath}: illegal import from ${fileImport.filepath}`,
          );
          continue;
        }

        if (expectedModule !== actualModule) {
          errors.push(
            `in ${filePath}: illegal import from ${actualModule} (expected ${expectedModule})`,
          );
        }
      }
    }
  }

  return errors;
}
