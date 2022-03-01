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
import { Init, Load, Save, WithLibrary, WithSimpleLibrary } from "./project";
import { CompileApp } from "./compiler";
import Logger from "./logger";
import { Ask } from "./utils/console";

export const Commands = {
  init: IsObject({
    project: IsString,
    "create-dir": Optional(IsUnion(IsLiteral("true"), IsLiteral("false"))),
  }),
  build: IsObject({ target: Optional(IsString), project: IsString }),
  load: IsObject({ project: IsString }),
  play: IsObject({ project: IsString }),
  "add-simple-library": IsObject({
    project: IsString,
    area: IsString,
    library: IsString,
  }),
  "add-library": IsObject({ project: IsString }),
  prepare: IsObject({ project: IsString }),
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
    "add-simple-library": async (args) => {
      const settings = await Load(args.project);
      const result = WithSimpleLibrary(settings, args.area, args.library);
      if (result === "NoArea") {
        Logger.AreaDoesNotExist(args.area);
        return;
      }

      if (result === "NoLibrary") {
        Logger.LibraryDoesNotExist(args.library);
        return;
      }

      await Save(args.project, result);
    },
    "add-library": async (args) => {
      const project = await Load(args.project);
      Save(
        args.project,
        WithLibrary(project, {
          simplelibraries: false,
          name: await Ask("What is the library name? (For dependency trees)"),
          include: await Ask("What is the include path?"),
          linker: await Ask("What is the linker path?"),
          depends: await (async function* () {
            while (true) {
              const dependency = await Ask(
                "Enter dependencies one at a time and leave blank to finish:"
              );
              if (
                dependency &&
                project.build.libraries
                  .geninq()
                  .any((l) => l.name === dependency)
              )
                yield dependency;
              else if (dependency) Logger.LibraryNotInProject(dependency);
              else return;
            }
          })().array(),
        })
      );
    },
    async prepare(args) {
      await Save(args.project, await Load(args.project));
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
