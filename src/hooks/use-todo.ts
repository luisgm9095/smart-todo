import { useCallback, useEffect, useState } from 'react';
import { addTodoChild, addTodoSibling, createTodo, updateTodo as updateTodoItem, deleteTodo as deleteTodoItem, reparentTodoItem, reparentTodoGlobal, reparentTodoSibling, selectTodo as selectTodoItem } from '../utils/todo';
import { mapTodoLocalList } from '../utils/todo-local';
import { addTreeNode } from '../utils/tree';
import { useLocalStorage } from './use-local-storage';

export const useTodo = (todoListId: TodoListId) => {
    const [storedTodos, setStoredTodos] = useLocalStorage<Todo[]>(`todos_${todoListId}`, [], mapTodoLocalList);
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

    const reparentTodo: ReparentTodoCallback = useCallback((params) => {
        const { id, parentId, siblingId } = params;
        
        if (!parentId && !siblingId) {
            setItems((state) => reparentTodoGlobal({ state, value: { id }}));
        } else if (siblingId) {
            setItems((state) => reparentTodoSibling({ state, value: { id, siblingId } }));
        } else if (parentId) {
            setItems((state) => reparentTodoItem({ state, value: { id, parentId } }));
        }
    }, []);

    const updateTodo: TodoCallback = useCallback((updatedTodo: Todo) => setItems((state) => updateTodoItem({ state, value: updatedTodo })), []);

    const deleteTodo: TodoCallback = useCallback((deletedTodo: Todo) => setItems((state) => deleteTodoItem({ state, value: deletedTodo})), []);
    
    const selectTodo: TodoCallback = useCallback((value: Todo) => setItems((state) => selectTodoItem({ state, value })), []);


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
