import { Project, validate } from "../config/types.ts";
import { parseJsonc, parseYaml } from "./deps.ts";

function loadConfig(filename: string): Project {
  const content = Deno.readTextFileSync(filename);

  let parseFunc: (s: string) => unknown;
  if (filename.endsWith(".json") || filename.endsWith(".jsonc")) {
    parseFunc = parseJsonc;
  } else {
    parseFunc = parseYaml;
  }

  return __loadConfigFromString(content, parseFunc);
}

function __loadConfigFromString(
  content: string,
  parseFunc: (s: string) => unknown,
): Project {
  const parsed = parseFunc(content);
  const project = validate(parsed);
  return project;
}

export { loadConfig };
