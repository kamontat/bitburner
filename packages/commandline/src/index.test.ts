import { describe, it } from "vitest";
import { Commandline } from "./commandline";

describe("default", () => {
  it("default", async () => {
    const l = console.log;
    await Commandline.mock("@kcbb/test", ["test", "--name", "hello", "--debug", "morning", "afternoon"])
      .commands({
        key: "test-hello",
        values: ["test", "hello"],
        event: {
          preload: () => l("test-hello command preload"),
          load: () => l("test-hello command load"),
          verify: () => {
            l("test-hello command verify");
            return undefined;
          },
        },
      })
      .commands({
        key: "test",
        values: ["test"],
        event: {
          preload: () => l("test command preload"),
          load: () => l("test command load"),
          loaded: () => l("test command loaded"),
          verify: () => {
            l("test command verify");
            return undefined;
          },
        },
      })
      .options({
        key: "name",
        values: ["--name", "-n"],
        event: {
          preload: () => l("name option preload"),
          load: () => l("name option load"),
          loaded: () => l("name option loaded"),
          verify: () => {
            l("name option verify");
            return undefined;
          },
        },
        // convert: s => s.split(","),
      })
      .options({
        key: "debug",
        values: ["--debug", "-d"],
        event: {
          preload: () => l("debug option preload"),
          load: () => l("debug option load"),
          loaded: () => l("debug option loaded"),
          verify: () => {
            l("debug option verify");
            return undefined;
          },
        },
      })
      .events({
        preload: () => l("commandline preload"),
        loaded: () => l("commandline loaded"),
        verify: () => {
          l("commandline verify");
          return undefined;
        },
        verifyCommand: () => {
          l("commandline verify-command");
          return undefined;
        },
        verifyOption: () => {
          l("commandline verify-option");
          return undefined;
        },
      })
      .build(v => {
        l(v.commands);
        l(v.options);
        l(v.unknown);
        l(v.raw);
      });
  });
});
