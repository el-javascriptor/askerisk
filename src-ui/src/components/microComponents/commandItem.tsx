import styles from './commandItem.module.css'
import type { ChatFragment } from "../../helpers/definitions"

interface CommandItemProps {
    fragment: ChatFragment;
}

function CommandItem({ fragment }: CommandItemProps) {

    return <div className={`${styles.commandItem} ${fragment.content.includes('Thought') ? styles.thoughtStyle : ''}`}>
        <div className={styles.dot}></div>
        {fragment.content}
    </div>
}

export default CommandItem;
