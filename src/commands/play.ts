import { IsObject, IsString, IsType } from "@paulpopat/safe-type";
import { Command as BuildCommand } from "./build";
import { Command as LoadCommand } from "./load";

export const IsArgs = IsObject({ project: IsString });

export async function Command(args: IsType<typeof IsArgs>) {
  await BuildCommand({ ...args, target: undefined });
  await LoadCommand(args);
}
