import { loadConfig } from "../config-reader/mod.ts";
import { testConfig } from "../config-validation/mod.ts";
import { testStructure } from "../structure-validation/mod.ts";
import { mermaid } from "../graph/mod.ts";

const CONFIG_FILE = ".fences.yaml";

const project = loadConfig(CONFIG_FILE);

// rudimentary CLI
const command: string | undefined = Deno.args[0];
if (!command) {
  console.error(`help: available commands: check | graph`);
  Deno.exit(1);
}
switch (command) {
  case "check": {
    const testConfigResult = testConfig(project);

    if (testConfigResult > 0) {
      Deno.exit(1);
    }

    const testStructureResult = testStructure(project);

    if (testStructureResult > 0) {
      Deno.exit(1);
    }
    break;
  }
  case "graph": {
    const graph = mermaid(project);
    console.log(graph);
    break;
  }
  default: {
    console.error(`unrecognized command: ${command}`);
    Deno.exit(1);
  }
}
