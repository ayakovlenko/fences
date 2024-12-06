import { difference } from "../collections/mod.ts";
import type { Project } from "../config/types.ts";
import { filterValues, groupBy, mapValues } from "./deps.ts";

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
      groupBy(moduleNames, (x) => x),
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

function findNonSensicalDependencies(project: Project): ValidationError[] {
  const moduleNames = getModuleNames(project);
  const dependencies = project.modules.flatMap((m) => m.dependsOn || []);
  const findNonSensicalDependencies = difference(dependencies, moduleNames);
  const errors: ValidationError[] = [];
  for (const name of findNonSensicalDependencies) {
    errors.push({
      kind: "NonsensicalDependency",
      details: `dependency refers to a non-existing module: ${name}`,
    });
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
