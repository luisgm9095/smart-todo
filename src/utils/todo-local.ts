import { createTodo } from './todo';

export const mapTodoLocal = (local: TodoLocal): Todo => ({
    ...createTodo(),
    ...Object.entries(local).reduce((prev, [key, value]) => value !== undefined ? { ...prev, [key]: value } : prev, {})
});

export const mapTodoLocalList = (local: TodoLocal[]): Todo[] => (local || []).map(mapTodoLocal);
