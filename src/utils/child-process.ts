import { exec } from "child_process";

export function Execute(command: string, cwd?: string, log?: boolean) {
  return new Promise<void>((res, rej) => {
    const proc = exec(
      command,
      { cwd: cwd, maxBuffer: 1024 * 1024 * 500 },
      (error, stdout, stderr) => {
        if (stderr) console.error(stderr);
        if (error !== null) {
          rej(error);
          return;
        }

        res();
      }
    );

    if (log) proc.stdout?.pipe(process.stdout);
  });
}
