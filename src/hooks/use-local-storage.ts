import { useState } from 'react';

type StateSetter<T> = (value: T | ((val: T) => T)) => void;

export const useLocalStorage = <T>(
    key: string, 
    initialValue: T
): [T, StateSetter<T>] => {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    const setValue: StateSetter<T> = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.log(error)
        }
    }

    return [ storedValue, setValue];
};
