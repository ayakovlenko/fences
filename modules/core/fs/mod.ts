import { join } from "@std/path/join";
import { walk, walkSync } from "@std/fs/walk";
import { Project } from "../../config/types.ts";

const exts = [
  "ts",
  "tsx",
  "js",
  "jsx",
];

export function getModuleSourceFilesSync(
  project: Project,
  moduleName: string,
): string[] {
  const basePath = project.path;

  const modulePath = join(basePath, moduleName);

  const walking = walkSync(modulePath, {
    includeDirs: false,
    exts,
  });

  const sources: string[] = [];
  for (const file of walking) {
    sources.push(file.path);
  }

  return sources;
}

export async function getModuleSourceFiles(
  project: Project,
  moduleName: string,
): Promise<string[]> {
  const basePath = project.path;

  const modulePath = join(basePath, moduleName);

  const walking = walk(modulePath, {
    includeDirs: false,
    exts,
  });

  const sources: string[] = [];
  for await (const file of walking) {
    sources.push(file.path);
  }

  return sources;
}
