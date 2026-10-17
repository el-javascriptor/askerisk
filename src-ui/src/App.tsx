import { useState } from 'react'
import './App.css'
import ChatBar from './components/chatbar'
import { ChatItem } from './components/chatresponse'
import { streamGenResponse } from './api'
import type { Chat } from "./helpers/definitions.ts"
import { addTokenToPrevChats } from './helpers/chat_helpers.ts'

function App() {

    const [chats, setChats] = useState<Chat[]>([]);
    const [useOllama, setUseOllama] = useState(false);
    const [pendingChat, setPendingChat] = useState(false);

    const clearChatsPending = chats.length == 0;

    function addTokenToLatestChat(token: string) {
        setChats((prevChats) => addTokenToPrevChats(token, prevChats))
    }

    function generateResponse(prompt: string) {
        if (prompt[0] == "/") {
            if (prompt == "/clear") {
                setChats([]);
                return;
            } else if (prompt == "/mode ollama") {
                setUseOllama(true);
                return;
            } else if (prompt == "/mode gemini") {
                setUseOllama(false);
                return;
            }
        }

        const new_chat: Chat = {
            role: "user",
            content: prompt
        }

        const response: Chat = {
            role: "assistant",
            content: ""
        }

        setChats((prevChats) => {
            return [...prevChats, new_chat, response]
        });

        setPendingChat(true);

        streamGenResponse(prompt, useOllama, clearChatsPending, addTokenToLatestChat, (state) => state ? setPendingChat(false) : '');

        setTimeout(() => {
            const scroll_container = document.querySelector(".chat-holder");

            if (scroll_container) {
                scroll_container.scrollTop = scroll_container.scrollHeight;
            }
        }, 100);
    }

    return <>
        <div className='main'>
            <div className={`chat-holder ${chats.length > 0 ? 'active-chat' : ''}`}>
                {
                    chats.map((chat, index) => {
                        return <ChatItem content={chat.content} key={index} role={chat.role} show_loading_animation={index == chats.length - 1 && pendingChat == true} />
                    })
                }
                <div className='invisibleScrollElement' />
            </div>
            <ChatBar generateResponse={generateResponse} />
        </div>
    </>
}

export default App
