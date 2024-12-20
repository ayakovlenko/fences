import { parse } from "@std/yaml/parse";
import { readFile } from "node:fs/promises";
import { Project, validate } from "./types.ts";

export async function loadConfig(filename: string): Promise<Project> {
  const content = await readFile(filename, "utf-8");

  const parsed = parse(content);

  const project = validate(parsed);

  return project;
}
