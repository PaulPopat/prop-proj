import "geninq";
import { Assert } from "@paulpopat/safe-type";
import Fs from "fs-extra";
import { IsProject, Library, Project } from "./types";
import Path from "path";
import { DefaultLibraries } from "./default-libraries";
import { GccDir, SimpleLibraries } from "./locations";
import { GetAllDevices } from "./runner";
import { Log } from "./logger";
import { Ask } from "./utils/console";

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
  run: {
    board: "default:default",
  },
};

function Dirname() {
  return process
    .cwd()
    .split(Path.delimiter)
    .geninq()
    .select_many((l) => l.split("/").geninq())
    .select_many((l) => l.split("\\").geninq())
    .last();
}

async function BuildCppConfig(
  project: Project,
  prefix: string,
  project_name: string
) {
  const default_device = await GetDefaultDevice();

  await Fs.outputJson(
    Path.join(prefix, ".vscode", "tasks.json"),
    {
      version: "2.0.0",
      tasks: [
        {
          label: `Build ${project_name}`,
          type: "shell",
          command: `prop-proj build --project=${project_name}`,
          group: "build",
        },
        {
          label: `Load ${project_name}`,
          type: "shell",
          command: `prop-proj load --project=${project_name} --serial=${default_device}`,
          group: "build",
        },
        {
          label: `Build and Run ${project_name}`,
          type: "shell",
          command: `prop-proj play --project=${project_name} --serial=${default_device}`,
          group: "build",
        },
        {
          label: `Update Source for ${project_name}`,
          type: "shell",
          command: `prop-proj update-source --project=${project_name}`,
        },
      ],
    },
    { spaces: 2 }
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
            ...project.build.libraries
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
          cStandard: "c99",
          cppStandard: "c++98",
          intelliSenseMode: "macos-clang-arm64",
        },
      ],
      version: 4,
    },
    { spaces: 2 }
  );
}

async function GetDefaultDevice() {
  const devices = await GetAllDevices();
  if (devices.length === 1) {
    return devices[0];
  }

  if (devices.length === 0) {
    await Log("project/no-devices", {});
    throw new Error("Command failed");
  }

  await Log("list-devices/list", {
    devices: devices.map((d) => "- " + d).join("\n"),
  });
  return await Ask("Which device would you like to use?");
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

  await BuildCppConfig(default_project, prefix, project_name);

  await Fs.outputFile(
    Path.join(prefix, ".gitignore"),
    `.vscode/c_cpp_properties.json
.vscode/tasks.json
bin
**/.DS_Store`
  );
}

export async function Load(project_name: string | null | undefined) {
  project_name = project_name ?? Dirname();
  const data = await Fs.readJson(`${project_name}.proproj`);
  Assert(IsProject, data);
  return data;
}

export async function Save(
  project_name: string | null | undefined,
  data: Project
) {
  project_name = project_name ?? Dirname();
  await Fs.writeJson(`${project_name}.proproj`, data, { spaces: 2 });
  await BuildCppConfig(default_project, ".", project_name);
}

export function WithSimpleLibrary(
  project: Project,
  area: string,
  library: string
) {
  const area_data = DefaultLibraries[area];
  if (!area_data) {
    return "NoArea" as const;
  }

  const library_data = area_data.find((l) => l.name === library);
  if (!library_data) {
    return "NoLibrary" as const;
  }

  return {
    ...project,
    build: {
      ...project.build,
      libraries: [...project.build.libraries, library_data],
    },
  };
}

export function WithLibrary(project: Project, library: Library) {
  return {
    ...project,
    build: {
      ...project.build,
      libraries: [...project.build.libraries, library],
    },
  };
}

export function WithSource(project: Project, source: string[]) {
  const to_add = source
    .geninq()
    .where((s) => !project.build.source.geninq().any((p) => p === s));
  const existing = project.build.source
    .geninq()
    .where((s) => source.geninq().any((n) => n === s));
  return {
    ...project,
    build: {
      ...project.build,
      source: [...existing, ...to_add],
    },
  };
}
