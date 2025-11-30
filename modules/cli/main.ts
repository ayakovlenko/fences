import { loadConfig } from "../config/load-config.ts";
import { check, checkLibraries, mermaidGraph } from "../feature/mod.ts";

const APP_VERSION = "0.1.1";

const CONFIG_FILE = ".fences.yaml";

const project = await loadConfig(CONFIG_FILE);

const availableCommands = [
  "version",
  "check",
  "graph",
] as const;

type CommandName = typeof availableCommands[number];

const args = Deno.args.slice();

// rudimentary CLI
const command = args.shift() as CommandName | undefined;

switch (command) {
  case "version": {
    console.log(APP_VERSION);

    break;
  }

  case "check": {
    const errors = [
      ...check(project),
      ...await checkLibraries(project),
    ];

    for (const error of errors) {
      console.log(`error: ${error}`);
    }

    if (errors.length > 0) {
      Deno.exit(1);
    }

    break;
  }

  case "graph": {
    console.log(mermaidGraph(project));

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
