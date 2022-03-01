import Minimist from "minimist";
import Logger from "./logger";

export async function RunCommand(command: string, args: string[]) {
  const data = require(`./commands/${command}`);
  if (!data) {
    Logger.InvalidCommand(command);
    process.exit(1);
  }

  const { Command, IsArgs, HelpText } = data;
  const parsed = Minimist(args) as any;
  delete parsed["--"];
  delete parsed._;
  if (!IsArgs(parsed)) {
    Logger.InvalidArguments(command, parsed, HelpText);
    process.exit(1);
  }

  await Command(parsed);
}
