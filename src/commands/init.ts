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

export const HelpText = `Init should have the project name and then optionally whether to create a directory or not.
By default this command will create a directory unless the current working directory is of
the same name as the project.
prop-proj init --project=ProjectName --create-dir=false`;
