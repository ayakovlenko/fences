import { parse } from "@std/yaml/parse";
import { Project, validate } from "../config/types.ts";

function loadConfig(filename: string): Project {
  const content = Deno.readTextFileSync(filename);

  const parsed = parse(content);

  const project = validate(parsed);

  return project;
}

export { loadConfig };
