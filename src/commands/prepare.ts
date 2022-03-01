import { IsObject, IsString, IsType, Optional } from "@paulpopat/safe-type";
import { Save, Load } from "../project";

export const IsArgs = IsObject({ project: Optional(IsString) });

export async function Command(args: IsType<typeof IsArgs>) {
  await Save(args.project, await Load(args.project));
}

export const HelpText = ``;
