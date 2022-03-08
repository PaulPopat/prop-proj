import { IsObject, IsString, IsType, Optional } from "@paulpopat/safe-type";
import { Load } from "../project";
import { LoadApp } from "../runner";

export const IsArgs = IsObject({ project: Optional(IsString), serial: IsString });

export async function Command(args: IsType<typeof IsArgs>) {
  const settings = await Load(args.project);
  await LoadApp(settings, false, `/dev/cu.usbserial-${args.serial}`);
}
