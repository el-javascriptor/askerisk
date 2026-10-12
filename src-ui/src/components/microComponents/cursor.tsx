import styles from './cursor.module.css';
import type { PositionType, CursorProps } from '../../helpers/definitions';

export function Cursor({ x, y, commandMode, visible }: CursorProps) {

    const inlineStyles: React.CSSProperties = {
        top: `${y}px`,
        left: `${x}px`,
        display: visible ? "flex" : "none"
    }

    return <div className={`${styles.cursor} ${commandMode ? styles.commandCursor : ''}`} style={inlineStyles}></div>
}

export function recalculateCursorLoc(barElement: HTMLDivElement): PositionType | null {
    const selection = window.getSelection();

    if (!selection.rangeCount) return null;

    const range = selection.getRangeAt(0).cloneRange();
    range.collapse()

    let box = range.getClientRects()[0];

    if (!box) {
        if (selection.focusNode instanceof Element) {
            box = selection.focusNode.getBoundingClientRect();
        } else {
            box = range.getBoundingClientRect()
        }
    }

    const x = box.left;
    const y = box.top;

    // now that we're computing relative locations,
    // we need the locations of the actual chatbar element as well.
    const barBoundingRect = barElement.getBoundingClientRect();
    const barTop = barBoundingRect.top;
    const barLeft = barBoundingRect.left;

    if (x == 0 && y == 0) {
        return {
            x: -10,
            y: -10
        }
    }

    return {
        x: x + 1 - barLeft,
        y: y - barTop
    }
}

// comment
