type FilterCallback<T> = (value: T) => boolean;

export const not = <T>(predicate: FilterCallback<T>) => (value: T): boolean => !predicate(value);
