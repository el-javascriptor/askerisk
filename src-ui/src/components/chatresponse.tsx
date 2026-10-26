import styles from './chatresponse.module.css'
import CommandItem from './microComponents/commandItem';
import ThoughtItem from './microComponents/thoughtItem';
import EventItem from './microComponents/eventItem';
import { ProcessedMarkdown } from './microComponents/markdown';
import askeriskLogo from './assets/AskeriskSmall.svg'
import type { DataBundle } from '../helpers/definitions';

interface ChatItemProps {
    bundles: DataBundle[];
    role: "user" | "assistant";
    show_loading_animation: boolean;
}

export function ChatItem({ bundles, role, show_loading_animation }: ChatItemProps) {

    const roleCSS = role == "user" ? styles.userRole : styles.assistantRole;

    return <div className={`${styles.chatResponse} ${roleCSS}`}>
        {bundles.map((bundle, index) => {
            if (bundle.type == "tool" && bundle.name == "thought") {
                return <ThoughtItem key={index} bundle={bundle} />;
            } else if (bundle.type == "tool") {
                return <CommandItem key={index} bundle={bundle} />;
            } else if (bundle.type == "event") {
                if (bundle.status == "error") {
                    return <EventItem key={index} bundle={bundle} />;
                }
            } else {
                return <ProcessedMarkdown text={bundle.content} />;
            }
        })}

        {show_loading_animation ? <img src={askeriskLogo} className={styles.spinningLogo} /> : ''}
    </div>
}
