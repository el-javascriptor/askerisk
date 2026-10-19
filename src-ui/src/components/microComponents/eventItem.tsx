import styles from './eventItem.module.css'
import type { EventBundle } from '../../helpers/definitions';

interface EventItemProps {
    bundle: EventBundle;
}

// TODO: Expand events to include notes ("Booted Ollama")
// TODO: Expand this component to be able to handle other kidns of errors too
function EventItem({ bundle }: EventItemProps) {

    return <div className={styles.eventItem}>
        <div className={styles.dot}></div>
        Error: {bundle.content}
    </div>
}

export default EventItem;
