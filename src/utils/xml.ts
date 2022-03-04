import "geninq";
import { XMLParser } from "fast-xml-parser";
import {
  Assert,
  DoNotCare,
  IsArray,
  IsBoolean,
  IsObject,
  IsRecord,
  IsString,
  IsUnion,
} from "@paulpopat/safe-type";
import object from "./object";
import Clc from "cli-color";

type Node = (
  children: unknown,
  attributes: Record<string, string | boolean>
) => string;

function Render(nodes: unknown[]) {
  const get_attributes_if_any = (n: Record<string, unknown>) => {
    const raw = n[":@"];
    if (!raw) return undefined;
    if (!IsObject({ attributes: DoNotCare })(raw)) return undefined;
    const attributes = raw.attributes;
    if (!IsRecord(IsString, IsUnion(IsString, IsBoolean))(attributes))
      return undefined;
    return attributes;
  };
  return nodes.geninq().aggregate("", (c, n) => {
    Assert(IsRecord(IsString, DoNotCare), n);
    const tag = object.Keys(n).first((k) => k !== ":@");
    Assert(IsString, tag);
    const attributes = get_attributes_if_any(n) ?? {};
    const children = n[tag];
    let result = Nodes[tag](children, attributes);
    if ((!c || c.endsWith("\n")) && result.startsWith("\n"))
      result = result.replace("\n", "");
    const spacer = !/^\s/.test(result) && c ? " " : "";
    return c + spacer + result;
  });
}

const Nodes: Record<string, Node> = {
  span: (children, _) => {
    Assert(IsArray(DoNotCare), children);
    return Render(children);
  },
  paragraph: (children, _) => {
    Assert(IsArray(DoNotCare), children);
    return "\n" + Render(children);
  },
  text: (children, _) => {
    Assert(IsString, children);
    return children;
  },
  clc: (children, attributes) => {
    Assert(IsArray(DoNotCare), children);
    const func: (data: string) => string = object
      .Keys(attributes)
      .aggregate(Clc as any, (c, n) => c[n]);
    return func(Render(children));
  },
  br: () => {
    return "\n";
  },
  li: (children) => {
    Assert(IsArray(DoNotCare), children);
    return "\n- " + Render(children);
  },
};

export function RenderXml(text: string) {
  const parsed = new XMLParser({
    ignoreAttributes: false,
    attributesGroupName: "attributes",
    textNodeName: "text",
    alwaysCreateTextNode: true,
    preserveOrder: true,
    allowBooleanAttributes: true,
    attributeNamePrefix: "",
  }).parse(text);

  Assert(IsArray(DoNotCare), parsed);
  return Render(parsed);
}
