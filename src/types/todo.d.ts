type TodoId = TreeNodeId;

type Todo = TreeNode & {
    title: string,
    checked: boolean,
    selected: boolean,
};

type AddTodoParams = {
    parentId?: TodoId,
    siblingId?: TodoId,
};

type ReparentTodoParams = {
    id: TodoId,
    parentId?: TodoId,
    siblingId?: TodoId
};

type TodoCallback = (todo: Todo) => void;
type AddTodoCallback = (params: AddTodoParams) => void;
type ReparentTodoCallback = (params: ReparentTodoParams) => void;

type EditTodoContext = {
    addTodo: AddTodoCallback,
    updateTodo: TodoCallback,
    deleteTodo: TodoCallback,
    selectTodo: TodoCallback,
    reparentTodo: ReparentTodoCallback,
};
