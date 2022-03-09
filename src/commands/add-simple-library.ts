import { IsObject, IsString, IsType, Optional } from "@paulpopat/safe-type";
import { Log } from "../logger";
import { Load, WithSimpleLibrary, Save } from "../project";

export const IsArgs = IsObject({
  project: Optional(IsString),
  area: IsString,
  library: IsString,
});

export async function Command(args: IsType<typeof IsArgs>) {
  const settings = await Load(args.project);
  const result = WithSimpleLibrary(settings, args.area, args.library);
  if (result === "NoArea") {
    await Log("add-simple-library/no-area", { area: args.area });
    throw new Error("Command failed");
  }

  if (result === "NoLibrary") {
    await Log("add-simple-library/does-not-exist", { library: args.library });
    throw new Error("Command failed");
  }

  await Save(args.project, result);
}
