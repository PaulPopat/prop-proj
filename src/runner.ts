import "geninq";
import { Project } from "./types";
import Fs from "fs-extra";
import { Build, PropLoader } from "./locations";
import { Log } from "./logger";
import { Execute } from "./utils/child-process";

function RunCommand(project: Project, run: boolean, port: string) {
  return [
    `-b ${project.run.board}`,
    "-D baud-rate=115200",
    `-p ${port}`,
    !run ? `-e` : undefined,
    run ? `-r` : undefined,
    run ? `-t` : undefined,
    `-v`,
    `bin/build.elf`,
  ]
    .filter((r) => r)
    .join(" ");
}

export async function LoadApp(project: Project, run: boolean, port: string) {
  await Log("loading-app", {});
  if (!(await Fs.pathExists(Build()))) {
    await Log("not-compiled", {});
    process.exit(1);
  }

  try {
    await Execute(
      PropLoader() + " " + RunCommand(project, run, port),
      undefined,
      true
    );
  } catch {}
}
