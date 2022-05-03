export type StateReducerParams<T,R> = {
    state: T,
    value: R
};

export type StateReducer<T,R> = (params: StateReducerParams<T,R>) => T;
