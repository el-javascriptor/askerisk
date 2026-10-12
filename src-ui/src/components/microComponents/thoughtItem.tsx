import styles from './thoughtItem.module.css'
import type { ChatFragment } from '../../helpers/definitions';

interface ThoughtItemProps {
    fragment: ChatFragment;
}

function ThoughtItem({ fragment }: ThoughtItemProps) {

    return <div className={styles.thoughtItem}>
        <div className={styles.dot}></div>
        Thought ({fragment.info} tokens)
    </div>
}

export default ThoughtItem;
