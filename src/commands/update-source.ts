import "geninq";
import { IsObject, IsString, IsType, Optional } from "@paulpopat/safe-type";
import { Load, Save, WithSource } from "../project";
import FileSystem from "../utils/file-system";
import { Source } from "../locations";
import Logger from "../logger";

export const IsArgs = IsObject({ project: Optional(IsString) });

export async function Command(args: IsType<typeof IsArgs>) {
  const project = await Load(args.project);

  Logger.UpdateSource.ScanningStarted();
  const source = await FileSystem.ReadDir(Source())
    .where((p) => p.endsWith(".cpp"))
    .array();
  const result = WithSource(project, source);
  await Save(args.project, result);
  Logger.UpdateSource.UpdatedSource(source.length);
}

export const HelpText = ``;
