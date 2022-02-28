import "geninq";
import { Gcc, SimpleLibraries } from "./locations";
import { Project } from "./types";
import Path from "path";
import { Execute } from "./utils/child-process";
import Fs from "fs-extra";

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
    "-o cmm/build.elf",
    `-O${flags.optimisation}`,
    `-m${flags.memory}`,
    `-m${project.build.doubles}bit-doubles`,
    "-fno-exceptions",
    project.build.runtime_types ? "-fno-rtti" : undefined,
    ...project.build.source,
    ...project.build.libraries.geninq().select_many((l) =>
      l.depends
        .geninq()
        .select((l) => "-l" + l)
        .append("-l" + l.name)
    ),
    project.build.use.maths ? "-lm" : undefined,
    project.build.use.parallel ? "-lpthread" : undefined,
    project.build.use.tiny ? "-ltiny" : undefined,
  ]
    .geninq()
    .where((l) => l != null)
    .aggregate("", (c, n) => c + " " + n);
}

export async function CompileApp(project: Project, preset: string) {
  if (!(await Fs.pathExists("cmm"))) {
    await Fs.mkdir("cmm");
  }

  console.log("Compiling with propeller-gcc");
  const command = BuildCommand(project, preset);
  try {
    await Execute(Gcc() + " " + command);
  } catch {
    console.log("The command was " + command);
    console.log("Compile failed. See output above.");
  }
}
