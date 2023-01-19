import { describe, it } from "vitest";
import { Graph } from "./graph";

const getMoney = (name: string): number => {
  switch (name) {
    case "a":
      return 10;
    case "b":
      return 43;
    case "c":
      return 78;
    case "d":
      return 94;
    case "e":
      return 57;
    case "f":
      return 26;
    case "g":
      return 81;
    default:
      return 0;
  }
};

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
          case "e":
            return ["f", "g", "home", "z"];
          case "z":
            return ["home"];
          default:
            return [];
        }
      },
    });

    // graph.toString();
    // graph.walk((h, p) => console.log(`walk ${h} (${p})`));

    const result = graph.reduce(
      {
        money: 0,
        server: "",
      },
      (p, h) => {
        const money = getMoney(h);
        if (money > p.money) {
          p.server = h;
          p.money = money;
        }

        return p;
      }
    );

    console.log(result);
  });
});
