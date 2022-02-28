import { exec } from "child_process";

export function Execute(command: string, cwd?: string, log?: boolean) {
  return new Promise<void>((res, rej) => {
    exec(command, { cwd: cwd, maxBuffer: 1024 * 1024 * 500 }, (error, stdout, stderr) => {
      if (log) console.log(stdout);
      if (stderr) console.error(stderr);
      if (error !== null) {
        rej(error);
        return;
      }

      res();
    });
  });
}
