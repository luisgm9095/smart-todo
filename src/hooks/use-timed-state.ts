import { useCallback, useState } from 'react';

export const useTimedState = <T>(initialValue: T): [T, (value:T, millis?: number) => void] => {
    const [value, setInternalValue] = useState(initialValue);
    const [storedTimeout, setStoredTimeout] = useState<NodeJS.Timeout>();

    const setValue = useCallback((value: T, millis = 0) => {
        if(storedTimeout) {
            clearTimeout(storedTimeout)
        }
        // Set internal value after millis timeout
        if(millis) {
            setStoredTimeout(setTimeout(() => setInternalValue(value), millis));
        // when millis not set, directly setInternal value
        } else {
            setInternalValue(value);
            setStoredTimeout(undefined);
        }
    }, [storedTimeout]);

    return [
        value,
        setValue
    ];
};
