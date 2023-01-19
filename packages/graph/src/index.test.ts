import { describe, it } from "vitest";
import { Graph } from "./graph";

describe("default", () => {
  it("test", () => {
    const graph = Graph.init({
      startPoint: "home",
      resolver: name => {
        switch (name) {
          case "home":
            return ["a", "b", "c"];
          case "a":
            return ["home", "d", "e"];
          case "b":
            return ["c", "a", "home"];
          default:
            return [];
        }
      }
    }).toString();

    // graph.walk((h, p) => {
    //   console.log(`name: ${h} (${p})`);
    // });
  });
});
