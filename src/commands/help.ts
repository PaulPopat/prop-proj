import "geninq";
import { IsObject, IsString, IsType, Optional } from "@paulpopat/safe-type";
import { Log } from "../logger";

export const IsArgs = IsObject({ command: Optional(IsString) });

export async function Command(args: IsType<typeof IsArgs>) {
  if (!args.command) await Log("commands/help", {});
  else await Log("commands/" + args.command, {});
}
