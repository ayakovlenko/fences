import type { Project } from "../config/types.ts";

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
    (count) => (count as number) > 1,
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

// https://jsr.io/@std/collections/1.1.3/filter_values.ts
function filterValues<T>(
  record: Readonly<Record<string, T>>,
  predicate: (value: T) => boolean,
): Record<string, T> {
  const result: Record<string, T> = {};
  const entries = Object.entries(record);

  for (const [key, value] of entries) {
    if (predicate(value)) {
      result[key] = value;
    }
  }

  return result;
}

// https://jsr.io/@std/collections/1.1.3/map_values.ts
export function mapValues<T, O, K extends string>(
  record: Record<K, T>,
  transformer: (value: T, key: K) => O,
  // deno-lint-ignore no-explicit-any
): any {
  // deno-lint-ignore no-explicit-any
  const result: any = {};
  const entries = Object.entries<T>(record);

  for (const [key, value] of entries) {
    const mappedValue = transformer(value, key as K);

    result[key] = mappedValue;
  }

  return result;
}

export { findNameClashes, findNonSensicalDependencies, validate };
