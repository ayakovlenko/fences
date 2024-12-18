import { Project } from "../config/types.ts";

// https://dreampuf.github.io/GraphvizOnline/
export function mermaidGraph(project: Project): string {
  let s = "";
  s += "flowchart TD\n";

  const states: Record<string, string> = {};
  for (const module of project.modules) {
    const id = module.name.replaceAll("-", "_").replaceAll("/", "_");
    states[module.name] = id;
    s += `    ${id}["${module.name}"]\n`;
  }

  s += "\n";

  for (const module of project.modules) {
    const state = states[module.name];

    for (const dependendentModule of module.dependsOn || []) {
      const dependentState = states[dependendentModule];
      s += `    ${state} --> ${dependentState}\n`;
    }
  }
  return s;
}

// https://dreampuf.github.io/GraphvizOnline/
// deno-lint-ignore no-unused-vars
function dot(project: Project): string {
  let s = "";
  s += "digraph G {\n";
  s += "  node [shape=record];\n";
  for (const module of project.modules) {
    for (const dependentModule of module.dependsOn || []) {
      s += `  ${module.name}" -> "${dependentModule}"\n`;
    }
  }
  s += "}\n";
  return s;
}
