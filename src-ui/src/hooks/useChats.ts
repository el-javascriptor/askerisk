// This file routes prompts to their various services,
// and keeps track of a few states.
import { useCallback, useRef, useState } from "react";
import type { Chat, CommandScope, DataBundle } from "../helpers/definitions";
import { addTokenToPrevChats } from "../helpers/chat_helpers";
import { streamGenResponse } from "../api";
import { process_command } from "../helpers/commands";

// this function acts as the router

// TODO: This function needs to return Chats, and optionally a new prompt,
// and the process_prompt function
export function useChats() {

    const [chats, setChats] = useState<Chat[]>([]);
    const useOllamaRef = useRef<boolean>(false);

    const clearChatsPending = chats.length == 0;

    const process_prompt = useCallback((prompt: string): string => {

        let new_prompt = "";

        if (prompt.length == 0) return "";

        // in this case, the prompt is a command, not an agentic question
        if (prompt[0] == "/") {

            const commandScope: CommandScope = { setChats, useOllamaRef };

            new_prompt = process_command(prompt, commandScope);

            // in this case, the prompt is an agentic question
        } else {

            setChats((prevChats) => {
                return [...prevChats, createUserPromptChat(prompt), createBlankAIChat()];
            })

            streamGenResponse(
                prompt,
                useOllamaRef.current,
                clearChatsPending,
                (bundle: DataBundle) => {
                    setChats((prevChats) => addTokenToPrevChats(bundle, prevChats));
                },
                () => { }
            );
        }

        return new_prompt;

    }, [chats]);

    return {
        chats: chats,
        process_prompt: process_prompt
    }
}

function createUserPromptChat(prompt: string): Chat {
    return {
        role: "user",
        content: [{
            "type": "token",
            "content": prompt
        }]
    }
}

function createBlankAIChat(): Chat {
    return {
        role: "assistant",
        content: []
    }
}
