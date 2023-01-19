import { describe, it } from "vitest";
import { Commandline } from "./commandline";
import { Converter } from "./converter";

describe("default", () => {
  it("default", () => {
    Commandline.test(["hello", "-T=test", "--money=1"])
      .options({
        name: "target",
        options: ["--target", "-T"],
        convert: Converter.string,
      })
      .options({
        name: "money",
        options: ["--money", "-M"],
        convert: Converter.float,
        default: () => `100.0`,
      })
      .build((value, ctx) => {
        console.log(value);
        console.log(ctx);
      });
  });
});
