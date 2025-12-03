import type { Project } from "../config/types.ts";
import { findNameClashes, findNonSensicalDependencies } from "./validation.ts";

function testConfig(project: Project): string[] {
  const errors: string[] = [];

  const clashes = findNameClashes(project);
  clashes.forEach((err) => {
    errors.push(`module names are not unique: ${err.details}`);
  });

  const nonSensicalDependencies = findNonSensicalDependencies(project);
  nonSensicalDependencies.forEach((err) => {
    errors.push(`module dependencies make no sense: ${err.details}`);
  });

  return errors;
}

export { testConfig };
