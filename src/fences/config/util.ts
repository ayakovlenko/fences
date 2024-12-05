import { Project } from "../config/types.ts";

function getModuleNames(project: Project): string[] {
  return project.modules.map((m) => m.name);
}

export { getModuleNames };
