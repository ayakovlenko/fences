import { Project } from "../config/types.ts";
import { validTransitionsGraph } from "./structure.ts";
import { Graph } from "./types.ts";

import { describe, it } from "@std/testing/bdd";
import { expect } from "@std/expect/expect";

describe("validTransitionsGraph", () => {
  it("must build graph of valid dependencies", () => {
    const project: Project = {
      path: "src/",
      modules: [
        {
          name: "foo",
          exposes: ["mod.ts"],
          dependsOn: [],
        },
        {
          name: "bar",
          exposes: ["mod.ts"],
          dependsOn: ["foo"],
        },
        {
          name: "baz",
          exposes: ["mod.ts"],
          dependsOn: ["foo", "bar"],
        },
      ],
    };

    const graph: Graph = {
      "foo": {},
      "bar": {
        "src/foo/mod.ts": "foo",
      },
      "baz": {
        "src/foo/mod.ts": "foo",
        "src/bar/mod.ts": "bar",
      },
    };

    expect(validTransitionsGraph(project)).toEqual(graph);
  });
});
