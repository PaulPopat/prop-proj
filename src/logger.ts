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
  InvalidCommands: {
    init() {
      console.log(
        Clc.red.bold("Invalid arguments for init."),
        `
Init should have the project name and then optionally whether to create a directory or not.
By default this command will create a directory unless the current working directory is of
the same name as the project.
prop-proj init --project=ProjectName --create-dir=false`
      );
    },
  },
  AreaDoesNotExist(area: string) {
    console.log(Clc.red.bold(`No area with name ${area}`));
  },
  LibraryDoesNotExist(library: string) {
    console.log(Clc.red.bold(`No library with name ${library}`));
  },
  LibraryNotInProject(library: string) {
    console.log(Clc.yellow(`No library with name ${library} in the project`));
  }
};
