import { readFile } from "node:fs/promises";
import { type Project, projectSchema } from "./types.ts";

export async function loadConfig(filename: string): Promise<Project> {
  const content = await readFile(filename, "utf-8");

  const project = projectSchema.parse(JSON.parse(content));

  return project;
}
