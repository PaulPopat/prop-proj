import Fs from "fs-extra";
import Path from "path";

export default {
  async *ReadDir(
    route: string,
    recursive: boolean = true
  ): AsyncGenerator<string> {
    const items = await Fs.readdir(route);
    for (const item of items) {
      const path = Path.join(route, item);
      const stat = await Fs.stat(path);
      if (stat.isDirectory()) yield* this.ReadDir(path, recursive);
      else yield path;
    }
  },
};
