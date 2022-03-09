# Prop Proj

This is a tool to use the command line to do building and running of Propeller C++ projects.

## Installation

Simply download the relevant zip from the releases and make sure the directory is in your path. At this point in time, only a MacOS build is available.

## Usage

Run `prop-proj init --project=PROJECT_NAME` to initialise a new project. This will create a new directory unless the CWD is of the same name as the project, in which case the project will be created inline. The `.gitignore` file that is made will include some items in the `.vscode` directory. This is intentional as these should be generated on each machine separately.

To load an existing project on to your computer, run `prop-proj prepare` to set up the build tasks and intellisence in VSCode.

Once you have your project prepared, you should be able to find the build tasks in VSCode and these should be used to build, run, and load your project onto a chip. Below is a list of all of the available commands for when working form the CLI or performing advanced actions.

- add-library (Add a custom library to the project. Will prompt for include and linker pathhs)
- add-simple-library (Add a Simple Tools library to the project. These are included in the distrobution)
- build (Build the current project)
- init (Create a new project)
- list-devices (List all devices attached to your machine that are recognised as a programmer)
- load (Load the current build to EEPROM)
- play (Build and run the current project in RAM)
- prepare (Generate build tasks and VSCode intellisence for the current machine)
- update-source (Scan the `./src` directory and add or remove `.cpp` files as relevant)

## Contribution

Anything is welcome! As long as the existing functionality isn't broken, chuck in a pull request. More unit tests will be added at some point to help ensure this. As well as GitHub actions for the build.