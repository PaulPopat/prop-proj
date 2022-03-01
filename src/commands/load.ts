import { IsObject, IsString, IsType } from "@paulpopat/safe-type";

export const IsArgs = IsObject({ project: IsString });

export async function Command(args: IsType<typeof IsArgs>) {
  throw new Error("This feature is not implemented yet.");
}

export const HelpText = ``;
