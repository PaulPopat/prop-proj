import { RenderXml } from "./xml";

describe("RenderXml", () => {
  it("Parses some spans", () => {
    const result = RenderXml("<span><span>test</span><span>text</span></span>");
    expect(result).toBe("test text");
  });

  it("Parses paragraphs", () => {
    const result = RenderXml(
      "<paragraph>test</paragraph><paragraph>text</paragraph>"
    );
    expect(result).toBe("test\ntext");
  });

  it("Runs clc commands", () => {
    const result = RenderXml("<clc red bold>test</clc>");
    expect(result).toBe("\u001b[1m\u001b[31mtest\u001b[39m\u001b[22m");
  });
});
