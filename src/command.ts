import Minimist from "minimist";
import { Log } from "./logger";

async function GetCommand(command: string) {
  try {
    return require(`./commands/${command}`);
  } catch {
    await Log("invalid-command", { command });
    process.exit(1);
  }
}

export async function RunCommand(command: string, args: string[]) {
  const { Command, IsArgs } = await GetCommand(command);
  const parsed = Minimist(args) as any;
  delete parsed["--"];
  delete parsed._;
  if (!IsArgs(parsed)) {
    await Log("invalid-arguments", { args: parsed, command });
    process.exit(1);
  }

  await Command(parsed);
}
