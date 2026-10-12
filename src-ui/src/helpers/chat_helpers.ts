import type { Chat } from "./definitions.ts"

// This function appends a token to the latest chat block.
// TODO: Needs new CJF format.
export function addTokenToPrevChats(token: string, prevChats: Chat[]): Chat[] {

    if (prevChats.length == 0) return prevChats;

    const allChatsButLast = prevChats.slice(0, -1);

    const lastChat = prevChats[prevChats.length - 1];

    const newLastChat = {
        ...lastChat,
        content: lastChat.content + token
    }
    return [...allChatsButLast, newLastChat];
}
