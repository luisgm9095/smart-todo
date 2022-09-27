import { useCallback, useEffect, useState } from 'react';
import { AddTodoCallback, addTodoChild, addTodoSibling, createTodo, hasTodoParentId, Todo, TodoId, updateTodo as updateTodoItem, deleteTodo as deleteTodoItem, reparentTodo as reparentTodoItem } from '../utils/todo';
import { TodoListId } from '../utils/todo-list';
import { useLocalStorage } from './use-local-storage';

export const useTodo = (todoListId: TodoListId) => {
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
    }, []);

    const getTodos = useCallback((parentId?: TodoId) => items.filter(hasTodoParentId(parentId)), [items]);

    const updateTodo = useCallback((updatedTodo: Todo) => setItems((items) => updateTodoItem({ items, updatedTodo })), []);

    const deleteTodo = useCallback((deletedTodo: Todo) => setItems((items) => deleteTodoItem({ items, deletedTodo})), []);

    const reparentTodo = useCallback((id: TodoId, parentId: TodoId) => setItems((items) => reparentTodoItem({ items, id, parentId })), [])

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
        addTodo,
        getTodos,
        updateTodo,
        deleteTodo,
        reparentTodo
    };
};
