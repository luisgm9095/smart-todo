import { useCallback, useEffect, useState } from 'react';
import { addTodoChild, addTodoSibling, createTodo, updateTodo as updateTodoItem, deleteTodo as deleteTodoItem, reparentTodo as reparentTodoItem, selectTodo as selectTodoItem } from '../utils/todo';
import { addTreeNode } from '../utils/tree';
import { useLocalStorage } from './use-local-storage';

export const useTodo = (todoListId: TodoListId) => {
    const [storedTodos, setStoredTodos] = useLocalStorage<Todo[]>(`todos_${todoListId}`, []);
    const [items, setItems] = useState<Todo[]>(storedTodos);

    const addTodo: AddTodoCallback = useCallback((params) => {
        const { parentId, siblingId } = params;
        
        if (!parentId && !siblingId) {
            setItems((items) => addTreeNode(items, createTodo()));
        } else if (siblingId) {
            setItems((state) => addTodoSibling({ state, value: siblingId }));
        } else if (parentId) {
            setItems((state) => addTodoChild({ state, value: parentId }));
        }
    }, []);

    const updateTodo: TodoCallback = useCallback((updatedTodo: Todo) => setItems((state) => updateTodoItem({ state, value: updatedTodo })), []);

    const deleteTodo: TodoCallback = useCallback((deletedTodo: Todo) => setItems((state) => deleteTodoItem({ state, value: deletedTodo})), []);
    
    const selectTodo: TodoCallback = useCallback((value: Todo) => setItems((state) => selectTodoItem({ state, value })), []);

    const reparentTodo: ReparentTodoCallback = useCallback((value) => setItems((state) => reparentTodoItem({ state, value })), []);

    useEffect(() => {
        if(storedTodos !== items) {
            setStoredTodos(items);
        }
    }, [items]);

    useEffect(() => {
        if(storedTodos !== items) {
            setItems(storedTodos);
        }
    }, [storedTodos]);

    return {
        tree: items,
        addTodo,
        updateTodo,
        deleteTodo,
        selectTodo,
        reparentTodo,
    };
};
