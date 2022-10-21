import { v4 as uuidv4 } from 'uuid';
import { hasTreeNodeId, hasTreeNodeIdAtPath, orderTree } from './tree';

export const createTodo = (parent?: Todo): Todo => ({
    id: uuidv4(),
    title: 'New Todo',
    checked: false,
    parentId: parent?.id,
    path: parent ? [ ...parent.path, parent.id ] : [],
    selected: false,
    collapsed: false,
    visible: true
});

export const hasTodoId = (id: TodoId) => (todo: Todo): boolean => todo.id === id;

export const hasTodoParentId = (parentId?: TodoId) => (todo: Todo): boolean => (!parentId && !todo.parentId) || todo.parentId === parentId;

export const isChecked = (todo: Todo): boolean => todo.checked;

export const isUnchecked = (todo: Todo): boolean => !todo.checked;

export const addTodoSibling: StateReducer<Todo[], TodoId> = ({ state: items, value: siblingId }) => {
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

export const addTodoChild: StateReducer<Todo[], TodoId>  = ({ state: items, value: parentId }) => {
    const parentIndex = items.findIndex(hasTodoId(parentId));
    const parent = items[parentIndex];
    const todo = createTodo(parent);
    const updatedTodos = [
        ...items.slice(0, parentIndex + 1),
        todo,
        ...items.slice(parentIndex + 1)
    ];

    return checkTodo({ state: updatedTodos, value: todo });
};

const getCollapseMap = (todos: Todo[]): TreeNodeMap<boolean> =>
    todos.reduce((prev, cur) =>({
        ...prev,
        [cur.id]: cur.collapsed
    }), {});

export const updateVisibility = (todosMap: TreeNodeMap<boolean>) => (todo: Todo): Todo => {
    const visible = !todo.path.some(id => Boolean(todosMap[id]));
    return visible === todo.visible ? todo : { ...todo, visible };
};

export const updateTodo: StateReducer<Todo[], Todo> = ({ state: items, value: updatedTodo }) => {
    const updatedTodoIndex = items.findIndex(hasTodoId(updatedTodo.id));
    const updatedTodos = [
        ...items.slice(0, updatedTodoIndex),
        updatedTodo,
        ...items.slice(updatedTodoIndex + 1)
    ];
    const checkedTodos = checkTodo({state: updatedTodos, value: updatedTodo});
    const collapseMap = getCollapseMap(checkedTodos); 
    const visibleTodos = checkedTodos.map(updateVisibility(collapseMap));
    
    return visibleTodos;
};

export const deleteTodo: StateReducer<Todo[], Todo> = ({ state: items, value: deletedTodo }) => {
    const updatedTodos = items.filter(({ id, path }) => id !== deletedTodo.id && !path.includes(deletedTodo.id));
    const checkTodos = checkTodo({ state: updatedTodos, value: deletedTodo });

    return checkTodos
};

export const reparentTodo: StateReducer<Todo[], ReparentTodoParams> = ({ state: items, value: {id, parentId} }) => {
    const element = items.find(hasTodoId(id)) as Todo;
    const parent = items.find(hasTodoId(parentId)) as Todo;
    const path = parent?.path || [];
    let updatedTodos = items;
    const haveSameParentId = element.parentId && element.parentId === parentId;
    
    if (!haveSameParentId && id !== parentId && !path.includes(id) && parent.parentId !== id) {
        const reparentedTodos = items.map<Todo>((item) => {
            const hasId = hasTreeNodeId(id)(item);
            const hasIdAtPath = hasTreeNodeIdAtPath(id)(item);
            return hasId || hasIdAtPath
                ? {
                    ...item,
                    parentId: hasId ? parentId : item.parentId,
                    path: [
                        ...path,
                        parentId,
                        ...(hasIdAtPath ? item.path.slice(item.path.findIndex(el => el === id)) : [])
                    ]
                } as Todo
                : item;
        });
        updatedTodos = orderTree(checkTodo({ state: reparentedTodos, value: parent}));
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

export const selectItem = (selected: Todo) => (todo: Todo): Todo => selected.id === todo.id
    ? { ...todo, selected: !todo.selected }
    : (!todo.selected ? todo : { ...todo, selected: false});

export const selectTodo: StateReducer<Todo[], Todo> = ({ state, value }) => state.map(selectItem(value));
