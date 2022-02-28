import {
  IsLiteral,
  IsObject,
  IsString,
  IsType,
  IsUnion,
  Optional,
} from "@paulpopat/safe-type";
import Object from "./utils/object";
import Minimist from "minimist";
import { Init, Load } from "./project";
import { CompileApp } from "./compiler";
import Logger from "./logger";

export const Commands = {
  init: IsObject({
    project: IsString,
    "create-dir": Optional(IsUnion(IsLiteral("true"), IsLiteral("false"))),
  }),
  build: IsObject({ target: Optional(IsString), project: IsString }),
  load: IsObject({ project: IsString }),
  play: IsObject({ project: IsString }),
};

type Command = keyof typeof Commands;
type Commands = { [TKey in Command]: IsType<typeof Commands[TKey]> };

export const IsCommand = IsUnion(
  ...Object.Keys(Commands).map((c) => IsLiteral(c))
);

const handlers: { [TKey in Command]: (args: Commands[TKey]) => Promise<void> } =
  {
    async init(args) {
      await Init(args.project, args["create-dir"] === "false");
    },
    async build(args) {
      const settings = await Load(args.project);
      await CompileApp(settings, args.target ?? "debug");
    },
    async load() {
      throw new Error("This feature is not implemented yet.");
    },
    async play(args) {
      await handlers.build({ ...args, target: "debug" });
      await handlers.load({ ...args });
    },
  };

export async function Run(command: Command, args: string[]) {
  const parsed = Minimist(process.argv.slice(2)) as any;
  delete parsed["--"];
  delete parsed._;
  if (!Commands[command](parsed)) {
    const logger = Logger.InvalidCommands as Record<Command, () => void>;
    logger[command]();
    return;
  }

  await handlers[command](parsed as any);
}
