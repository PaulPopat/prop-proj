import Clc from "cli-color";

export default {
  InvalidCommand(command: string) {
    console.log(
      Clc.red.bold(`Your command of ${command} is invalid.`),
      `
Please use one of the standard commands at the start of your app. These are:
- init (initialise a new project)
- build (build the program using propeller GCC)
- load (load the most recent build onto your propeller chip)
- play (build and load a project)`
    );
  },
  InvalidArguments(command: string, args: object, help_text: string) {
    console.log(
      Clc.red.bold(`Invalid arguments for ${command}.\n`),
      Clc.yellow(
        `You have input ${JSON.stringify(
          args
        )}. Showing the help for the command below.\n`
      ),
      help_text
    );
  },
  AreaDoesNotExist(area: string) {
    console.log(Clc.red.bold(`No area with name ${area}`));
  },
  LibraryDoesNotExist(library: string) {
    console.log(Clc.red.bold(`No library with name ${library}`));
  },
  LibraryNotInProject(library: string) {
    console.log(Clc.yellow(`No library with name ${library} in the project`));
  },
  UpdateSource: {
    ScanningStarted() {
      console.log("Starting a scan of the ./src directory.");
    },
    UpdatedSource(count: number) {
      console.log(
        `Found ${count} C++ files. Adding to project if they are not already included.`
      );
    },
  },
};
