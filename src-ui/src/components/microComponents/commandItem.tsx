import styles from './commandItem.module.css'
import type { ToolBundle } from "../../helpers/definitions"
import { map_name } from '../../helpers/command_mapping';

interface CommandItemProps {
    bundle: ToolBundle;
}

function CommandItem({ bundle }: CommandItemProps) {

    return <div className={`${styles.commandItem}`}>
        <div className={styles.dot}></div>
        {map_name(bundle.name)}
    </div>
}

export default CommandItem;
