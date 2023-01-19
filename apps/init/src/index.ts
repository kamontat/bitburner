import { Commandline, defineVersionOption, defineLoggerOption, defineTargetOption } from "@kcbb-libs/commandline";

const main: MainFunction = async ns => {
  Commandline.init(ns)
    .options(defineVersionOption(__VERSION__))
    .options(defineLoggerOption())
    .options(defineTargetOption())
    .build((value, ctx) => {
      ctx.logger.tinfo("%s", value);
    });
};

export { main };
