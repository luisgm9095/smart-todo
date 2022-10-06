import { createContext, useContext } from 'react';

const _DEFAULT_CALLBACK = () => void 0;

const EditTodoContext = createContext<EditTodoContext>({
    addTodo: _DEFAULT_CALLBACK,
    deleteTodo: _DEFAULT_CALLBACK,
    reparentTodo: _DEFAULT_CALLBACK,
    selectTodo: _DEFAULT_CALLBACK,
    updateTodo: _DEFAULT_CALLBACK
});

export const useEditTodoContext = () => useContext(EditTodoContext);

export const EditTodoProvider = EditTodoContext.Provider;