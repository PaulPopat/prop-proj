import { IsObject, IsString, IsType, Optional } from "@paulpopat/safe-type";
import { Load, WithSimpleLibrary, Save } from "../project";
import Logger from "../logger";

export const IsArgs = IsObject({
  project: Optional(IsString),
  area: IsString,
  library: IsString,
});

export async function Command(args: IsType<typeof IsArgs>) {
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
}

export const HelpText = ``;
