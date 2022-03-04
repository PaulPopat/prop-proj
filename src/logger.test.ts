import { Log } from "./logger";

let file_contents = "";

jest.mock("fs-extra", () => ({
  readFile: async () => file_contents,
  pathExists: async () => true,
}));

describe("Log", () => {
  it("Loads a JavaScript expression", async () => {
    const log = jest.spyOn(console, "log").mockImplementation();
    file_contents = "<span>{'Hello ' + 'world'}</span>";
    await Log("any", {});
    expect(log).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledWith("Hello world");
    log.mockRestore();
  });
});
