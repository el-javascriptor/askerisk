import { useEffect, useState, useCallback } from "react";
import type { RefObject } from "react";
import { recalculateCursorLoc } from "../components/microComponents/cursor";
import type { PositionType } from "../helpers/definitions";

export function useCursorPosition(container_ref: RefObject<HTMLDivElement | null>) {

    const [cursorPos, setCursorPos] = useState<PositionType>({ x: 0, y: 0 });

    const refresh = useCallback(() => {

        const newPos = recalculateCursorLoc(container_ref.current);

        if (newPos == null) return;

        setCursorPos(newPos);

    }, [container_ref]);

    useEffect(() => {

        document.addEventListener('selectionchange', refresh);

        return () => document.removeEventListener('selectionchange', refresh);
    }, [refresh]);

    return {
        cursorPos: cursorPos,
        refresh: refresh
    }

}
