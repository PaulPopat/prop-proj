import { IsObject, IsString, IsType, Optional } from "@paulpopat/safe-type";
import { CompileApp } from "../compiler";
import { Load } from "../project";

export const IsArgs = IsObject({
  target: Optional(IsString),
  project: IsString,
});

export async function Command(args: IsType<typeof IsArgs>) {
  const settings = await Load(args.project);
  await CompileApp(settings, args.target ?? "debug");
}

export const HelpText = ``;
