import type { Chat, DataBundle } from "./definitions.ts"

// This function appends a bundle to the latest chat block.
export function addTokenToPrevChats(bundle: DataBundle, prevChats: Chat[]): Chat[] {

    if (prevChats.length == 0) return prevChats;

    // We keep everything before the last chat, unmutated
    const allChatsButLast = prevChats.slice(0, -1);

    // The last chat will change, so we'll need to copy it into newLastChat
    const lastChat = prevChats[prevChats.length - 1];

    const newLastChat: Chat = {
        ...lastChat,
        content: []
    }

    const allBundlesButLast = lastChat.content.slice(0, -1);

    // we need to mutate the last bundle of the last chat, as we'll be changing it
    const lastBundle = lastChat.content.at(-1);

    if (lastBundle === undefined || lastBundle.type != "token" || bundle.type != "token") {

        // copy the stuff from bundle into lastBundle
        newLastChat.content = [...lastChat.content, bundle];

    } else {

        const newLastBundle = { ...lastBundle };

        newLastBundle.content += bundle.content;
        newLastChat.content = [...allBundlesButLast, newLastBundle];
    }

    return [...allChatsButLast, newLastChat];
}
