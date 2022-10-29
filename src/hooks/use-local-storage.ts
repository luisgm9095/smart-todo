import { useCallback, useEffect, useState } from 'react';

type StateSetter<T> = (value: T | ((val: T) => T)) => void;

const mapLocalDefault = <T, U = T>(value: U): T => (value as unknown) as T;

const readStorage = <T, U = T>(key: string, defaultValue: T, mapFunction: (_:U) => T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? mapFunction(JSON.parse(item)) : defaultValue;
    } catch (error) {
        console.log(error);
        return defaultValue;
    }
};

export const useLocalStorage = <T, U = T>(
    key: string, 
    initialValue: T,
    mapFunction: (_:U) => T = mapLocalDefault
): [T, StateSetter<T>] => {
    const [storedKey, setStoredKey] = useState(key);
    const [storedValue, setStoredValue] = useState<T>(() => readStorage(key, initialValue, mapFunction));

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
            setStoredValue(readStorage(key, initialValue, mapFunction))
        }
    }, [key, initialValue]);

    return [ storedValue, setValue];
};
