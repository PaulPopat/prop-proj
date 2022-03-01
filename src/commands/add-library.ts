import { IsObject, IsString, IsType } from "@paulpopat/safe-type";
import { Load, Save, WithLibrary } from "../project";
import { Ask } from "../utils/console";
import Logger from "../logger";

export const IsArgs = IsObject({ project: IsString });

export async function Command(args: IsType<typeof IsArgs>) {
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
            project.build.libraries.geninq().any((l) => l.name === dependency)
          )
            yield dependency;
          else if (dependency) Logger.LibraryNotInProject(dependency);
          else return;
        }
      })().array(),
    })
  );
}

export const HelpText = ``;
