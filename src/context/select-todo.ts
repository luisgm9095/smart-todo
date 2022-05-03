import { createContext, useContext } from 'react';
import { TodoId } from '../utils/todo';

type SelectTodoContextParams = {
    selectedTodoId?: TodoId
    setSelectedTodoId: (id?: TodoId) => void
}

const SelectTodoContext = createContext<SelectTodoContextParams>({ setSelectedTodoId: () => void 0 });

export const useSelectTodoContext = () => useContext(SelectTodoContext);

export const SelectTodoProvider = SelectTodoContext.Provider;