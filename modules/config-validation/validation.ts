import type { Project } from "../config/types.ts";

import { filterValues } from "@std/collections/filter-values";
import { mapValues } from "@std/collections/map-values";

type ValidationErrorKind =
  | "ModuleNameClash"
  | "NonsensicalDependency"
  | "ModulePathIsNotADirectory"
  | "ExportIsNotAFile";

type ValidationError = {
  kind: ValidationErrorKind;
  details: string;
};

function getModuleNames(project: Project): string[] {
  return project.modules.map((m) => m.name);
}

// --- validations ---

function findNameClashes(project: Project): ValidationError[] {
  const moduleNames = getModuleNames(project);
  const clashes = filterValues(
    mapValues(
      Object.groupBy(moduleNames, (x) => x),
      (names) => names!.length,
    ),
    (count) => count > 1,
  );
  const errors: ValidationError[] = [];
  for (const name of Object.keys(clashes)) {
    errors.push({
      kind: "ModuleNameClash",
      details: `clashing module name: ${name}`,
    });
  }
  return errors;
}

// @refactored(2024-12-07)
function findNonSensicalDependencies(project: Project): ValidationError[] {
  const validModuleNames = new Set(getModuleNames(project));
  const errors: ValidationError[] = [];

  for (const module of project.modules) {
    const dependencies = module.dependsOn || [];

    for (const dependency of dependencies) {
      if (!validModuleNames.has(dependency)) {
        const details =
          `dependency in '${module.name}' refers to a non-existing module '${dependency}'`;

        errors.push({
          kind: "NonsensicalDependency",
          details,
        });
      }
    }
  }

  return errors;
}

function validate(project: Project): ValidationError[] {
  return [
    ...findNameClashes(project),
    ...findNonSensicalDependencies(project),
  ];
}

export { findNameClashes, findNonSensicalDependencies, validate };
