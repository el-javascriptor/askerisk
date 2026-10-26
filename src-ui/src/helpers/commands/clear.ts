import type { CommandScope } from "../definitions";

export function clearCommand(_args: string[], commandScope: CommandScope): string {

    // we completely ignore args
    commandScope.setChats([]);

    return "";
}
