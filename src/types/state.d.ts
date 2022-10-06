type StateReducerParams<T,R> = {
    state: T,
    value: R
};

type StateReducer<T,R> = (params: StateReducerParams<T,R>) => T;
