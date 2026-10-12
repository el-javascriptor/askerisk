import { useEffect } from 'react';
import type { RefObject } from 'react';

export function useAutoFocus(focus_point: RefObject<HTMLDivElement | null>) {

    useEffect(() => {
        function reFocusCursor() {
            focus_point.current?.focus();
        }

        window.addEventListener('focus', reFocusCursor);

        return () => window.removeEventListener('focus', reFocusCursor);
    }, [focus_point]);

}
