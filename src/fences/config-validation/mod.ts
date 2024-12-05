import { Project } from "../config/types.ts";
import { findNameClashes, findNonSensicalDependencies } from "./validation.ts";

function testConfig(project: Project): number {
  console.log("module names are unique");

  const clashes = findNameClashes(project);
  clashes.forEach((err) => {
    console.error(`  ${err.details}`);
  });

  console.log("module dependencies make sense");

  const nonSensicalDependencies = findNonSensicalDependencies(project);
  nonSensicalDependencies.forEach((err) => {
    console.error(`  ${err.details}`);
  });

  return clashes.length + nonSensicalDependencies.length;
}

export { testConfig };
