import type { CommandScope } from "./definitions";
import { modeCommand } from "./commands/mode";
import { clearCommand } from "./commands/clear";
import { mathCommand } from "./commands/math";

// The process_command function takes a command prompt, routes it to the
// appropriate command module, and returns the new prompt.
export function process_command(command_str: string, commandScope: CommandScope): string {

    const [command, ...args] = splitCommandString(command_str);
    let returnString = "";

    switch (command) {

        case "clear":
            returnString = clearCommand(args, commandScope);
            break;

        case "mode":
            returnString = modeCommand(args, commandScope);
            break;

        case "math":
            returnString = mathCommand(args, commandScope);
            break;

        default:
            break;

    }

    return returnString;
}

function splitCommandString(command: string): string[] {
    return command.substring(1).split(" ");
}
