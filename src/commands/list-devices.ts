import "geninq";
import { IsObject, IsType } from "@paulpopat/safe-type";
import { Log } from "../logger";
import { GetAllDevices } from "../runner";

export const IsArgs = IsObject({});

export async function Command(args: IsType<typeof IsArgs>) {
  const devices = await GetAllDevices();
  await Log("list-devices/list", {
    devices: devices.map((d) => "- " + d).join("\n"),
  });
}
