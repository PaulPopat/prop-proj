import Path from "path";

let resources = "resources";

export function AddPrefix(prefix: string) {
  resources = Path.join(prefix, "resources");
}

export const Resources = () => resources;
export const PropLoader = () => Path.join(resources, "proploader");
export const SimpleLibraries = () => Path.join(resources, "lib");
export const GccDir = () => Path.join(resources, "gcc");
export const Gcc = () => Path.join(GccDir(), "bin", "propeller-elf-c++");

export const Source = () => "src";
export const HelpText = () => Path.join(__dirname, "../help-text");
