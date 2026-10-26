import type { CommandScope } from "../definitions";

export function mathCommand(args: string[], _commandScope: CommandScope): string {
    // to be edited to be more safe
    try {
        return `/math ${eval(args.join(" "))}`;
    } catch (e) {
        return `/math Error: ${e}`
    }
}
