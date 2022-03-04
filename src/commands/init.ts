import {
  IsLiteral,
  IsObject,
  IsString,
  IsType,
  IsUnion,
  Optional,
} from "@paulpopat/safe-type";
import { Init } from "../project";

export const IsArgs = IsObject({
  project: IsString,
  "create-dir": Optional(IsUnion(IsLiteral("true"), IsLiteral("false"))),
});

export async function Command(args: IsType<typeof IsArgs>) {
  await Init(args.project, args["create-dir"] === "false");
}
