import type { CommandScope } from "../definitions";

export function modeCommand(args: string[], commandScope: CommandScope): string {

    // make sure they gave us an arguments
    if (args.length <= 0) return "";

    // the first argument will be the mode to switch to
    switch (args[0]) {

        case "ollama":
            commandScope.useOllamaRef.current = true;
            break;
        case "gemini":
            commandScope.useOllamaRef.current = false;
            break;
        default:
            break;

    }

    return "";
}
