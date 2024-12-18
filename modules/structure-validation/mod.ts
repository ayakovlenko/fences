import type { Project } from "../config/types.ts";
import { findIllegalImports } from "./validation.ts";

function testStructure(project: Project): string[] {
  const errors: string[] = [];

  const illegalImports = findIllegalImports(project);
  illegalImports.forEach((err) => {
    errors.push(`illegal import:  ${err}`);
  });

  return errors;
}

export { testStructure };
