import { useCallback, useEffect, useState } from 'react';
import { AddTodoCallback, addTodoChild, addTodoSibling, createTodo, hasTodoParentId, Todo, TodoId, updateTodo as updateTodoItem, deleteTodo as deleteTodoItem } from '../utils/todo';
import { useLocalStorage } from './use-local-storage';

export const useTodo = (todoListId: string) => {
    const [storedTodos, setStoredTodos] = useLocalStorage<Todo[]>(`todos_${todoListId}`, []);
    const [items, setItems] = useState<Todo[]>(storedTodos);

    const addTodo: AddTodoCallback = useCallback((params) => {
        const { parentId, siblingId } = params;
        
        if (!parentId && !siblingId) {
            setItems((items) => [...items, createTodo()]);
        } else if (siblingId) {
            setItems((items) => addTodoSibling({ items, siblingId }));
        } else if (parentId) {
            setItems((items) => addTodoChild({ items, parentId }));
        }
        window.scrollTo(window.scrollX, window.scrollY + 32);
    }, []);

    const getTodos = useCallback((parentId?: TodoId) => items.filter(hasTodoParentId(parentId)), [items]);

    const updateTodo = useCallback((updatedTodo: Todo) => setItems((items) => updateTodoItem({ items, updatedTodo })), []);

    const deleteTodo = useCallback((deletedTodo: Todo) => setItems((items) => deleteTodoItem({ items, deletedTodo})), []);

    useEffect(() => {
        if(storedTodos !== items) {
            setStoredTodos(items);
        }
    }, [items]);

    return {
        addTodo,
        getTodos,
        updateTodo,
        deleteTodo
    };
};
