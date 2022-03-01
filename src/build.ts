import "geninq";
import Fs from "fs-extra";
import Http from "https";
import Path from "path";
import { Execute } from "./utils/child-process";
import Minimist from "minimist";
import {
  AddPrefix,
  Resources,
  PropLoader,
  SimpleLibraries,
  GccDir,
} from "./locations";

const proploader_path =
  "https://github.com/parallaxinc/PropLoader/releases/download/v1.0-37/proploader-{{platform}}.zip";
const simplelibraries_path =
  "https://github.com/parallaxinc/Simple-Libraries/releases/download/v1.4.155/Learn-Folder-Updated-2021.05.27.zip";
const gcc_path = "/opt/parallax";

const supported = ["mac", "linux"] as const;
type Platform = typeof supported[number];
const pkg_platforms: Record<Platform, string> = {
  mac: "latest-macos-x64",
  linux: "latest-linux-x64",
};

function GetFile(url: string, write_to: string) {
  return new Promise<void>((res, rej) => {
    const file = Fs.createWriteStream(write_to);
    Http.get(url, async (response) => {
      if (!response.statusCode || response.statusCode > 399) {
        rej(response);
        return;
      }

      if (response.statusCode === 302) {
        if (!response.headers.location) {
          rej("Invalid redirect");
          return;
        }

        await GetFile(response.headers.location, write_to);
        res();
        return;
      }

      response.pipe(file).on("finish", res).on("error", rej);
    });
  });
}

async function Unzip(path: string) {
  await Execute(`unzip ${Path.basename(path)}`, Path.dirname(path));
}

async function GetUnixPropLoader(platform: string) {
  const dir = Path.dirname(PropLoader());
  const loader_zip = Path.join(dir, "proploader.zip");
  await GetFile(proploader_path.replace("{{platform}}", platform), loader_zip);
  await Unzip(loader_zip);
  await Fs.chmod(PropLoader(), 0o755);
  await Fs.rm(loader_zip);
}

async function BuildUnixGcc() {
  if (!(await Fs.pathExists(gcc_path))) {
    throw new Error("Propeller GCC is not at /opt/parallax");
  }

  await Fs.copy(gcc_path, GccDir());
}

async function GetLibraries() {
  await Fs.mkdir(SimpleLibraries());
  const libraries_zip = Path.join(SimpleLibraries(), "simple_libraries.zip");
  await GetFile(simplelibraries_path, libraries_zip);
  await Unzip(libraries_zip);
  await Fs.copy(
    Path.join(SimpleLibraries(), "Learn", "Simple Libraries"),
    SimpleLibraries()
  );
  await Fs.remove(Path.join(SimpleLibraries(), "version.txt"));
  await Fs.remove(Path.join(SimpleLibraries(), "Learn"));
  await Fs.remove(libraries_zip);
}

process.on("uncaughtException", function (exception) {
  console.error(exception);
});

process.on("unhandledRejection", (reason, p) => {
  console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});

(async () => {
  const args = Minimist(process.argv.slice(2));
  const platform: Platform = args.platform;

  if (
    !supported
      .map((a) => a)
      .geninq()
      .any((a) => a === platform)
  ) {
    throw new Error("Build platform not supported");
  }

  const build_dir = "build";
  if (await Fs.pathExists(build_dir)) {
    await Fs.remove(build_dir);
  }

  AddPrefix(build_dir);
  await Fs.mkdir(build_dir);
  await Fs.mkdir(Resources());
  console.log("Building the proploader");
  await GetUnixPropLoader(platform);
  console.log("Preparing libraries");
  await GetLibraries();
  console.log("Building GCC");
  await BuildUnixGcc();

  console.log("Compiling application");
  await Execute(
    `pkg -t ${pkg_platforms[platform]} --output ./build/prop-proj .`,
    undefined,
    true
  );
})().catch((err) => {
  console.error(err);
  process.exit(1);
});
