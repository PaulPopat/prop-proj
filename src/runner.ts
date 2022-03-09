import "geninq";
import { Project } from "./types";
import Fs from "fs-extra";
import { Build, PropLoader } from "./locations";
import { Log } from "./logger";
import { Execute } from "./utils/child-process";

function RunCommand(project: Project, run: boolean, port: string) {
  return [
    `-b ${project.run.board}`,
    "-s",
    "-D baudrate=115200 -D clkfreq=80mhz",
    `-p ${port}`,
    !run ? `-e` : undefined,
    `-r`,
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

export async function GetAllDevices() {
  const result = await Execute(PropLoader() + " -P");
  return result
    .split("\n")
    .filter((r) => r)
    .map((r) => r.split("-")[1]);
}
