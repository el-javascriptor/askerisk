import styles from './commandItem.module.css'
import type { ChatFragment, ToolBundle } from "../../helpers/definitions"

interface CommandItemProps {
    bundle: ToolBundle;
}

function CommandItem({ bundle }: CommandItemProps) {

    return <div className={`${styles.commandItem}`}>
        <div className={styles.dot}></div>
        {bundle.name}
    </div>
}

export default CommandItem;
