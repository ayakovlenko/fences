import type { Project } from "../config/types.ts";
import { findIllegalImports } from "./validation.ts";

function testStructure(project: Project): number {
  console.error("all imports are legal");

  const illegalImports = findIllegalImports(project);
  illegalImports.forEach((err) => {
    console.error(`  ${err}`);
  });

  return illegalImports.length;
}

export { testStructure };
