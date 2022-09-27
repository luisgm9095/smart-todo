import { v4 as uuidv4 } from 'uuid';
import { StateReducer } from './state';

export type TodoId = string;

export type Todo = {
    id: TodoId,
    title: string,
    checked: boolean,
    parentId?: TodoId,
    path: TodoId[]
};

export type AddTodoParams = {
    parentId?: TodoId,
    siblingId?: TodoId,
};

export type AddSiblingParams = {
    items: Todo[],
    siblingId: TodoId
};

export type AddChildParams = {
    items: Todo[],
    parentId: TodoId
};

export type UpdateTodoParams = {
    items: Todo[],
    updatedTodo: Todo
};

export type DeleteTodoParams = {
    items: Todo[],
    deletedTodo: Todo
};

export type ReparentTodoParams = {
    items: Todo[],
    id: TodoId,
    parentId: TodoId
};

export type AddTodoCallback = (params: AddTodoParams) => void;
export type GetTodosCallback = (parentId?: TodoId) => Todo[];
export type UpdateTodoCallback = (params: UpdateTodoParams) => void;

export const createTodo = (parent?: Todo): Todo => ({
    id: uuidv4(),
    title: 'New Todo',
    checked: false,
    parentId: parent?.id,
    path: parent ? [ ...parent.path, parent.id ] : []
});

export const hasTodoId = (id: TodoId) => (todo: Todo): boolean => todo.id === id;

export const hasTodoParentId = (parentId?: TodoId) => (todo: Todo): boolean => (!parentId && !todo.parentId) || todo.parentId === parentId;

export const isChecked = (todo: Todo): boolean => todo.checked;

export const isUnchecked = (todo: Todo): boolean => !todo.checked;

export const addTodoSibling = ({ items, siblingId }: AddSiblingParams): Todo[] => {
    const siblingIndex = items.findIndex(hasTodoId(siblingId));
    const sibling = items[siblingIndex];
    const parent = sibling.parentId ? items.find(hasTodoId(sibling.parentId)) : undefined;
    const todo = createTodo(parent);
    const updatedTodos = [
        ...items.slice(0, siblingIndex),
        todo,
        ...items.slice(siblingIndex)
    ];
    const checkedTodos = checkTodo({ state: updatedTodos, value: todo });

    return checkedTodos;
};

export const addTodoChild = ({ items, parentId }: AddChildParams): Todo[] => {
    const parent = items.find(hasTodoId(parentId));
    const todo = createTodo(parent);
    const updatedTodos = [ ...items, todo ];
    const checkTodos = checkTodo({ state: updatedTodos, value: todo });
    return checkTodos;
};

export const updateTodo = ({ items, updatedTodo }: UpdateTodoParams): Todo[] => {
    const updatedTodoIndex = items.findIndex(hasTodoId(updatedTodo.id));
    const updatedTodos = [
        ...items.slice(0, updatedTodoIndex),
        updatedTodo,
        ...items.slice(updatedTodoIndex + 1)
    ];
    const checkedTodos = checkTodo({state: updatedTodos, value: updatedTodo});
    
    return checkedTodos;
}

export const deleteTodo = ({ items, deletedTodo }: DeleteTodoParams): Todo[] => {
    const updatedTodos = items.filter(({ id, path }) => id !== deletedTodo.id && !path.includes(deletedTodo.id));
    const checkTodos = checkTodo({ state: updatedTodos, value: deletedTodo });

    return checkTodos
};

export const reparentTodo = ({ items, id, parentId }: ReparentTodoParams): Todo[] => {
    const parent = items.find(hasTodoId(parentId)) as Todo;
    const path = parent?.path || [];
    let updatedTodos = items;
    
    if (id !== parentId && !path.some(el => el === id) && parent.parentId !== id) {
        console.log('reparenting');
        const reparentedTodos = items.map<Todo>((item) => ({
            ...item,
            parentId: item.id === id ? parentId : item.parentId,
            path: item.path.some(el => el === parentId) ? [
                ...path,
                parentId,
                ...item.path.slice(item.path.findIndex(el => el === id))
            ] : item.path
        }));
        updatedTodos = checkTodo({ state: reparentedTodos, value: parent});
    }
    
    return updatedTodos;
}

export const areDirectChildrenChecked = (id: TodoId, items: Todo[]): boolean =>
    items.filter(hasTodoParentId(id)).every(isChecked);

export const checkTodo: StateReducer<Todo[], Todo> = ({ state: todos, value: todo }) => todo.checked
    // Check uptree iterative if rest of siblings are checked aswell
    ? todo.path.reduceRight((updatedTodos, id) => areDirectChildrenChecked(id, updatedTodos)
        ? updatedTodos.map((item) => hasTodoId(id)(item) ? { ...item, checked: true} : item)
        : updatedTodos, todos)
    // Check downtree all
    .map((item) => item.path.includes(todo.id) ? { ...item, checked: true} : item)
    // Uncheck downtree all
    : todos.map((item) => item.path.includes(todo.id) || todo.path.includes(item.id) ? { ...item, checked: false} : item);
