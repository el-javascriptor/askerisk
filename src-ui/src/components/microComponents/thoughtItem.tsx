import styles from './thoughtItem.module.css'
import type { ChatFragment, ToolBundle } from '../../helpers/definitions';

interface ThoughtItemProps {
    bundle: ToolBundle;
}

function ThoughtItem({ bundle }: ThoughtItemProps) {

    return <div className={styles.thoughtItem}>
        <div className={styles.dot}></div>
        Thought
    </div>
}

export default ThoughtItem;
