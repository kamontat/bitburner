import { describe, it } from "vitest";
import { Commandline } from "./commandline";
import { Converter } from "./converter";

describe("default", () => {
  it("default", () => {
    Commandline.test("test", ["hello", "-T=test", "--money=1"])
      .options({
        name: "target",
        options: ["--target", "-T"],
        convert: Converter.string,
      })
      .options({
        name: "money",
        options: ["--money", "-M"],
        convert: Converter.float,
        default: () => 100.0,
      })
      .build(async (value, ctx) => {
        console.log(value);
        console.log(ctx);
      });

    Commandline.init(undefined as unknown as NS)
      .default("@kcws/test", "0.0.1", "2023-01-01", [])
      // <cmd> upgrade server --option -t arguments 1 2 3
      .commands({
        name: "upgrade",
        commands: ["upgrade", "server"],
        exec: (args, ctx) => {
          console.log(args);
          console.log(ctx)
        }
      })
  });
});
