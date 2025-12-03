import type { Project } from "../config/types.ts";
import { testConfig } from "../config-validation/mod.ts";
import { testStructure } from "../structure-validation/mod.ts";

export function check(project: Project): string[] {
  const testConfigResult = testConfig(project);

  const testStructureResult = testStructure(project);

  return [
    ...testConfigResult,
    ...testStructureResult,
  ];
}
