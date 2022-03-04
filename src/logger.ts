import "geninq";
import Path from "path";
import Fs from "fs-extra";
import { HelpText } from "./locations";
import { RenderXml } from "./utils/xml";
import object from "./utils/object";

export function* GetExpressions(value: string) {
  let current = "";
  let depth = 0;
  for (const char of value) {
    if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        yield current;
        current = "";
      }
    }

    if (depth > 0) {
      current += char;
    }

    if (char === "{") {
      depth += 1;
    }
  }
}

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
async function Evaluate(
  expression: string,
  data: { name: string; value: any }[]
) {
  return await new AsyncFunction(
    ...data
      .geninq()
      .select((d) => d.name)
      .append("return " + expression)
  )(...data.geninq().select((d) => d.value));
}

async function Load(url: string, data: Record<string, string>) {
  const path = Path.join(HelpText(), url + ".xml");
  if (!(await Fs.pathExists(path))) {
    console.log(path + " does not exist.");
    process.exit(1);
  }

  let text = await Fs.readFile(path, "utf-8");
  text = text.replace(/\s+/gm, " ");

  for (const expression of GetExpressions(text)) {
    text = text.replace(
      `{${expression}}`,
      await Evaluate(expression, [
        ...object.Keys(data).select((key) => ({ name: key, value: data[key] })),
        { name: "load", value: (url: string) => Load(url, data) },
      ])
    );
  }

  return RenderXml(text);
}

export async function Log(url: string, data: Record<string, string>) {
  console.log(await Load(url, data));
}
