import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import type { Project } from "../../config/types.ts";

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
    sources.push(file);
  }

  return sources;
}

export async function getModuleSourceFiles(
  project: Project,
  moduleName: string,
): Promise<string[]> {
  const basePath = project.path;

  const modulePath = join(basePath, moduleName);

  const files = walkSync(modulePath, {
    includeDirs: false,
    exts,
  });

  const sources: string[] = [];
  for (const file of files) {
    sources.push(file);
  }

  return sources;
}

function walkSync(dirPath: string, options?: {
  includeDirs?: boolean;
  exts?: string[];
}): string[] {
  const toReturn: string[] = [];

  for (const dirFile of readdirSync(dirPath)) {
    const fullPath = join(dirPath, dirFile);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      const subFiles = walkSync(fullPath, options);
      toReturn.push(...subFiles);

      if (options?.includeDirs) {
        toReturn.push(fullPath);
      }
      continue;
    }

    if (!options?.exts) {
      toReturn.push(fullPath);
      continue;
    }

    for (const ext of options.exts) {
      if (dirFile.endsWith(`.${ext}`)) {
        toReturn.push(fullPath);
        break;
      }
    }
  }

  return toReturn;
}
