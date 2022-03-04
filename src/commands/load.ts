import { IsObject, IsString, IsType, Optional } from "@paulpopat/safe-type";

export const IsArgs = IsObject({ project: Optional(IsString) });

export async function Command(args: IsType<typeof IsArgs>) {
  throw new Error("This feature is not implemented yet.");
}
