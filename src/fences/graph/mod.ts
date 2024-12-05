import { Project } from "../config/types.ts";

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

// https://dreampuf.github.io/GraphvizOnline/
function mermaid(project: Project): string {
  let s = "";
  s += "stateDiagram-v2\n";

  const states: Record<string, string> = {};
  for (let i = 0; i < project.modules.length; i++) {
    const name = project.modules[i].name;
    const state = `s${i}`;
    states[name] = state;
    s += `    state "${name}" as ${state}\n`;
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

export { mermaid };
