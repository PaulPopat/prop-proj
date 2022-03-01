import ReadLine from "readline";

export function Ask(question: string) {
  return new Promise<string>((res, rej) => {
    const readline = ReadLine.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readline.question(question + " ", (answer) => {
      readline.close();
      res(answer);
    });
  });
}
