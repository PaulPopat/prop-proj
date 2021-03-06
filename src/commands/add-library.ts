import { IsObject, IsString, IsType, Optional } from "@paulpopat/safe-type";
import { Log } from "../logger";
import { Load, Save, WithLibrary } from "../project";
import { Ask } from "../utils/console";

export const IsArgs = IsObject({ project: Optional(IsString) });

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
          else if (dependency)
            await Log("add-library/not-in-project", { library: dependency });
          else return;
        }
      })().array(),
    })
  );
}
