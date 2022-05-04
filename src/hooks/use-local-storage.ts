import { useCallback, useEffect, useState } from 'react';

type StateSetter<T> = (value: T | ((val: T) => T)) => void;

const readStorage = <T>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.log(error);
        return defaultValue;
    }
};

export const useLocalStorage = <T>(
    key: string, 
    initialValue: T
): [T, StateSetter<T>] => {
    const [storedKey, setStoredKey] = useState(key);
    const [storedValue, setStoredValue] = useState<T>(() => readStorage(key, initialValue));

    const setValue: StateSetter<T> = useCallback((value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error)
        }
    }, [key, storedValue]);

    useEffect(() => {
        if(key !== storedKey) {
            setStoredKey(key);
            setStoredValue(readStorage(key, initialValue))
        }
    }, [key, initialValue]);

    return [ storedValue, setValue];
};
