import { loadConfig } from "../config-reader/mod.ts";
import { testConfig } from "../config-validation/mod.ts";
import { testStructure } from "../structure-validation/mod.ts";
import { mermaid } from "../graph/mod.ts";

const CONFIG_FILE = ".fences.yaml";

const project = loadConfig(CONFIG_FILE);

const availableCommands = [
  "check",
  "graph",
] as const;

type CommandName = typeof availableCommands[number];

const args = Deno.args.slice();

// rudimentary CLI
const command = args.shift() as CommandName | undefined;

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
    console.log(`unknown command: ${command}`);
    console.log();
    console.log("available commands:");
    console.log();
    console.log(availableCommands.map((c) => "- " + c).join("\n"));
    Deno.exit(1);
  }
}
