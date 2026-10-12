import { useState, useRef } from 'react';
import { useAutoFocus } from '../hooks/useAutoFocus.ts';
import { useCursorPosition } from '../hooks/useCursorPosition.ts';
import styles from './chatbar.module.css'
import askeriskLogo from './assets/Askerisk.svg'
import { Cursor } from './microComponents/cursor'

interface ChatBarProps {
    generateResponse: Function;
}

function ChatBar({ generateResponse }: ChatBarProps) {

    const [prompt, setPrompt] = useState('');
    const [searchBarFocused, setSearchBarFocused] = useState<boolean>(false);
    const editableDivRef = useRef<HTMLDivElement>(null);
    const chatBarRef = useRef<HTMLDivElement>(null);
    const commandMode = prompt[0] == '/' ? true : false;

    const { cursorPos, refresh } = useCursorPosition(chatBarRef);
    useAutoFocus(editableDivRef);

    const checkForEnter = (event) => {
        if (event.key == "Enter" && event.type == "keydown") {
            event.preventDefault();
            if (editableDivRef.current) editableDivRef.current.innerHTML = "";
            generateResponse(prompt);
            setPrompt("");
            requestAnimationFrame(refresh);
        }
    }

    const updatePrompt = () => setPrompt(editableDivRef.current?.innerText || "");

    return <div className={styles.chatBar} ref={chatBarRef} >
        <img className={styles.chatImage} src={askeriskLogo} />
        <div onKeyDown={checkForEnter} onInput={updatePrompt} onFocus={() => setSearchBarFocused(true)} onBlur={() => setSearchBarFocused(false)} className={`${styles.chatInput} ${commandMode ? styles.commandInput : ''}`} autoFocus={true} data-placeholder='Askerisk anything...' ref={editableDivRef} contentEditable></div>
        <Cursor x={cursorPos.x} y={cursorPos.y} commandMode={commandMode} visible={searchBarFocused} />
    </div >
}

export default ChatBar;
