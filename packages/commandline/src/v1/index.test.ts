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
      .options({
        name: "upgrade",
        values: ["--upgrade", "-U"],
        convert: Converts.string,
        // optional
        help: { description: "", default: d => d.toString() },
        // optional
        default: Defaults.constant("test"),
        // optional
        verify: () => new Error("verify failed"),
        // optional
        exec: (opts, ctx) => {
          console.log(opts);
          console.log(ctx);
        },
      })
      // User must provide command,
      // otherwise, this cli will exit with non-zero
      .commands(requireCommand())
      // <cmd> upgrade server argument 1 2 3
      // args = ["argument", 1, 2, 3]
      .commands({
        name: "upgrade",
        values: ["upgrade", "server"],
        // optional
        help: { description: "" },
        // optional
        verify: () => new Error("verify failed"),
        // optional
        exec: (args, ctx) => {
          console.log(args);
          console.log(ctx);
        },
      });
  });
});
