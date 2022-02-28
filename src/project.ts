import "geninq";
import { Assert } from "@paulpopat/safe-type";
import Fs from "fs-extra";
import { IsProject, Project } from "./types";
import Path from "path";
import { DefaultLibraries } from "./default-libraries";
import { GccDir, SimpleLibraries } from "./locations";

const basic_libraries = [
  {
    simplelibraries: true,
    name: "simpletools",
    include: "Utility/libsimpletools",
    linker: "Utility/libsimpletools/cmm/",
    depends: ["m"],
  },
  {
    simplelibraries: true,
    name: "simpletext",
    include: "TextDevices/libsimpletext",
    linker: "TextDevices/libsimpletext/cmm/",
    depends: ["simpletools", "m"],
  },
  {
    simplelibraries: true,
    name: "simplei2c",
    include: "Protocol/libsimplei2c",
    linker: "Protocol/libsimplei2c/cmm/",
    depends: ["simpletext", "simpletools", "m"],
  },
];

const default_project: Project = {
  build: {
    libraries: basic_libraries,
    source: ["src/main.cpp"],
    presets: {
      debug: {
        optimisation: 0,
        memory: "cmm",
        fast_cache: false,
      },
      production: {
        optimisation: "s",
        memory: "cmm",
        fast_cache: true,
      },
    },
    use: {
      maths: true,
      parallel: false,
      tiny: true,
    },
    runtime_types: true,
    doubles: 32,
  },
};

function Dirname() {
  const split = process.cwd().split(Path.delimiter);
  return split.geninq().last();
}

export async function Init(project_name: string, create_dir?: boolean) {
  const prefix =
    (create_dir === undefined && Dirname() === project_name) || !create_dir
      ? "."
      : project_name;
  await Fs.outputJson(
    Path.join(prefix, project_name + ".proproj"),
    default_project,
    {
      spaces: 2,
    }
  );

  await Fs.outputFile(
    Path.join(prefix, "src", "main.cpp"),
    `#include "simpletools.h"

int main()
{
  print("Hello!");
}`
  );

  await Fs.outputJson(
    Path.join(prefix, ".vscode", "c_cpp_properties.json"),
    {
      configurations: [
        {
          name: "Mac",
          includePath: [
            Path.join("${workspaceFolder}", "**"),
            Path.join(GccDir(), "propeller-elf", "include"),
            ...default_project.build.libraries
              .geninq()
              .select((l) =>
                l.simplelibraries
                  ? Path.join(SimpleLibraries(), l.include)
                  : l.include
              ),
          ],
          defines: [],
          macFrameworkPath: [
            "/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/System/Library/Frameworks",
          ],
          compilerPath: "/usr/bin/clang",
          cStandard: "c17",
          cppStandard: "c++20",
          intelliSenseMode: "macos-clang-arm64",
        },
      ],
      version: 4,
    },
    {
      spaces: 2,
    }
  );

  await Fs.outputFile(
    Path.join(prefix, ".gitignore"),
    `.vscode/c_cpp_properties.json
.vscode/tasks.json
cmm
**/.DS_Store`
  );
}

export async function Load(project_name: string) {
  const data = await Fs.readJson(`${project_name}.proproj`);
  Assert(IsProject, data);
  return data;
}
