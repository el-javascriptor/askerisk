import styles from './chatresponse.module.css'
import CommandItem from './microComponents/commandItem';
import ThoughtItem from './microComponents/thoughtItem';
import askeriskLogo from './assets/AskeriskSmall.svg'
import type { ParseStatus, ContinuityStatus, ChatFragment } from '../helpers/definitions';

interface ChatItemProps {
    content: string;
    role: "user" | "assistant";
    show_loading_animation: boolean;
}

export function ChatItem({ content, role, show_loading_animation }: ChatItemProps) {

    const roleCSS = role == "user" ? styles.userRole : styles.assistantRole;
    const structuredContent = parseContent(content);

    return <div className={`${styles.chatResponse} ${roleCSS}`}>
        {role == "user" ? content : structuredContent.map((value, index) => {
            if (value.type == "THOUGHT") {
                return <ThoughtItem key={index} fragment={value} />;
            } else if (value.type == "TOOL") {
                return <CommandItem key={index} fragment={value} />;
            } else {
                return <p key={index}>{value.content}</p>;
            }
        })}

        {show_loading_animation ? <img src={askeriskLogo} className={styles.spinningLogo} /> : ''}
    </div>
}

// TODO: Refactor to include new CJF format
function parseContent(content: string) {
    let status: ParseStatus = "TEXT";
    let tempHolder: string = "";
    const structured_content: ChatFragment[] = [];

    function addFragment(length: number, info: string, newStatus: ParseStatus, stat: ContinuityStatus = "COMPLETE") {
        tempHolder = tempHolder.slice(0, -length);
        tempHolder = tempHolder.trim();

        const newFragment: ChatFragment = {
            content: tempHolder,
            type: status,
            info: info,
            status: stat
        }

        if (tempHolder != "" && tempHolder != " ") structured_content.push(newFragment);

        status = newStatus;
        tempHolder = "";
    }

    for (const char of content) {

        tempHolder += char;

        // for each of the special tags, <think>, </think>, <tool>, </tool>
        if (tempHolder.length >= 7 && tempHolder.slice(-7) == "<think>") {
            addFragment(7, "", "THOUGHT");
        } else if (tempHolder.length >= 8 && tempHolder.slice(-8) == "</think>") {
            addFragment(8, tempHolder.split(" ").length.toString(), "TEXT");
        } else if (tempHolder.length >= 6 && tempHolder.slice(-6) == "<tool>") {
            addFragment(6, "", "TOOL");
        } else if (tempHolder.length >= -7 && tempHolder.slice(-7) == "</tool>") {
            addFragment(7, "", "TEXT");
        } else {
            // we just keep on processing
        }
    }

    if (tempHolder.length != 0) {
        tempHolder = tempHolder.trim();

        const newFragment: ChatFragment = {
            content: tempHolder,
            type: status,
            info: "",
            status: "COMPLETE"
        }

        if ((status as ParseStatus) == "THOUGHT") newFragment.info = tempHolder.split(" ").length.toString();

        structured_content.push(newFragment);
    }

    return structured_content;
}

