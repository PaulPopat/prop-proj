import { AddPrefix } from "./locations";
import Path from "path";
import { RunCommand } from "./command";

(async () => {
  const command = process.argv[2];
  if ("pkg" in process) {
    AddPrefix(Path.dirname(process.execPath));
  } else {
    AddPrefix(__dirname);
  }

  RunCommand(command, process.argv.slice(2));
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
