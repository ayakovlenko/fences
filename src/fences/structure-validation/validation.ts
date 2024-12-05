import { Project } from "../config/types.ts";
import { getModuleImports, validTransitionsGraph } from "./structure.ts";

function findIllegalImports(project: Project): string[] {
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

        if (module.skipFurther) {
          continue;
        }

        const expectedModule =
          validTransitions[module.name][fileImport.filepath];

        if (!expectedModule) {
          errors.push(
            `Illegal import from ${fileImport.filepath} in ${filePath}`,
          );
          continue;
        }

        if (expectedModule !== actualModule) {
          errors.push(
            `Illegal import from ${actualModule} in ${filePath} (expected ${expectedModule})`,
          );
        }
      }
    }
  }

  return errors;
}

export { findIllegalImports };
