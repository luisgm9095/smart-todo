import { useCallback, useEffect, useState } from 'react';
import { not } from '../utils/functional';
import { createTodoList, hasTodoListId, TodoList, TodoListId } from '../utils/todo-list';
import { useLocalStorage } from './use-local-storage';

export const useTodoList = (): {
    items: TodoList[],
    selectedItem: TodoList,
    addItem: () => void,
    changeItem: (todoList: TodoList) => void,
    deleteItem: (id: TodoListId) => void,
    selectItem: (id: TodoListId) => void
    moveItem: (id: TodoListId, targetId: TodoListId) => void
} => {
    const [storedItems, setStoredItems] = useLocalStorage<TodoList[]>('todo-lists', [ createTodoList() ]);
    const [items, setItems] = useState(storedItems);
    const [selectedItem, setSelectedItem] = useState(items[0]);

    const selectItem = useCallback((id: TodoListId) => {
        const item = items.find(hasTodoListId(id));
        if(item) {
            setSelectedItem(item);
        }
    }, [items]);

    const addItem = useCallback(() => {
        const newItem = createTodoList();
        setItems((items) => [ ...items, newItem]);
        setSelectedItem(newItem);
    }, []);

    const deleteItem = useCallback((id: TodoListId) => {
        if(items.length > 1) {
            const newItems = items.filter(not(hasTodoListId(id)));
            setItems(newItems);
            setSelectedItem(newItems[0]);
        }
    }, [items]);

    const changeItem = useCallback((todoList: TodoList) => {
        const index = items.findIndex(hasTodoListId(todoList.id));
        const updatedItems = [
            ...items.slice(0,index),
            todoList,
            ...items.slice(index + 1)
        ];
        
        setItems(updatedItems);
    }, [items]);

    const moveItem = useCallback((id: TodoListId, targetId: TodoListId) => {
        id !== targetId && setItems((prev) => prev.reduce<TodoList[]>((acc, cur, _, array) => [
            ...acc, 
            ...(cur.id === targetId ? [array.find(el => el.id === id) as TodoList, cur] : cur.id === id ? [] : [cur])
        ], []));
    }, []);

    useEffect(() => {
        if(storedItems !== items) {
            setStoredItems(items);
        }
    }, [items]);

    return {
        items,
        selectedItem,
        addItem,
        changeItem,
        deleteItem,
        selectItem,
        moveItem
    };
};
