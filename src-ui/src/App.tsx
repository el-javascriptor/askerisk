import { useChats } from './hooks/useChats.ts'
import './App.css'
import ChatBar from './components/chatbar'
import { ChatItem } from './components/chatresponse'

function App() {

    const { chats, process_prompt } = useChats();

    const pendingChat = chats.at(-1)?.content.at(-1)?.type != "event";

    function generateResponse(prompt: string, overwritePrompt: Function) {

        const new_prompt = process_prompt(prompt);

        overwritePrompt(new_prompt);

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
                        return <ChatItem bundles={chat.content} key={index} role={chat.role} show_loading_animation={index == chats.length - 1 && pendingChat == true} />
                    })
                }
                <div className='invisibleScrollElement' />
            </div>
            <ChatBar generateResponse={generateResponse} />
        </div>
    </>
}

export default App
