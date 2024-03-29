import { v4 as uuidv4 } from 'uuid';

export const createTodoList = () => ({
    id: uuidv4(),
    title: 'New Todo List'
});


export const hasTodoListId = (id: TodoListId) => (todoList: TodoList): boolean => todoList.id === id;
