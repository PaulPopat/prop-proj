import { AddPrefix } from "./locations";
import Path from "path";
import { IsCommand, Run } from "./command";
import Logger from "./logger"

(async () => {
  const command = process.argv[2];
  if (!IsCommand(command)) {
    Logger.InvalidCommand(command);
    process.exit(1);
  }

  if ("pkg" in process) {
    AddPrefix(Path.dirname(process.execPath));
  } else {
    AddPrefix(__dirname);
  }

  Run(command, process.argv.slice(3));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
