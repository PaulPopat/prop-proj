import { IsObject, IsString, IsType, Optional } from "@paulpopat/safe-type";
import { CompileApp } from "../compiler";
import { Load } from "../project";
import { LoadApp } from "../runner";

export const IsArgs = IsObject({ project: Optional(IsString), serial: IsString  });

export async function Command(args: IsType<typeof IsArgs>) {
  const settings = await Load(args.project);
  await CompileApp(settings, "debug");
  await LoadApp(settings, true, `/dev/cu.usbserial-${args.serial}`);
}
