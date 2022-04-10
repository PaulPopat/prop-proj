import "geninq";
import { Build, BuildDir, Gcc, SimpleLibraries } from "./locations";
import { Project, Library, Std } from "./types";
import Path from "path";
import { Execute } from "./utils/child-process";
import Fs from "fs-extra";
import { Log } from "./logger";

function BuildLibrary(library: Library) {
  return library.depends.map((d) => "-l" + d).join(" ") + " -l" + library.name;
}

function BuildLinker(libraries: Library[]) {
  return libraries
    .map((l) => [BuildLibrary(l), l] as const)
    .sort(([as, al], [bs, bl]) => (as.includes(bl.name) ? -1 : 1))
    .map(([s, l]) => s)
    .join(" ");
}

function BuildCommand(project: Project, preset: string) {
  const flags = project.build.presets[preset];
  return [
    "-I .",
    "-L .",
    ...project.build.libraries
      .geninq()
      .select((l) =>
        l.simplelibraries
          ? {
              ...l,
              include: Path.join(SimpleLibraries(), l.include),
              linker: Path.join(SimpleLibraries(), l.linker),
            }
          : l
      )
      .select_many((l) => [`-I ${l.include}`, `-L ${l.linker}`].geninq()),
    "-o " + Build(),
    `-O${flags.optimisation}`,
    `-m${flags.memory}`,
    `-m${project.build.doubles}bit-doubles`,
    "-fno-exceptions",
    project.build.runtime_types ? "-fno-rtti" : undefined,
    ...project.build.source,
    BuildLinker(project.build.libraries),
    project.build.use.maths ? "-lm" : undefined,
    project.build.use.parallel ? "-lpthread" : undefined,
    project.build.use.tiny ? "-ltiny" : undefined,
  ]
    .geninq()
    .where((l) => l != null)
    .aggregate("", (c, n) => c + " " + n);
}

export async function CompileApp(project: Project, preset: string) {
  if (!(await Fs.pathExists(BuildDir()))) {
    await Fs.mkdir(BuildDir());
  }

  await Log("compiling-app", {});
  const command = BuildCommand(project, preset);
  try {
    await Execute(Gcc() + " " + command);
  } catch {
    await Log("compile-failed", {});
    console.log("The command was:\n" + command);
  }
}
