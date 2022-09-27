import cn from 'classnames';
import { TodoAdd } from '../todo-add/todo-add';
import { TodoItem } from '../todo-item/todo-item';
import { AddTodoCallback, GetTodosCallback, Todo, TodoId } from '../../utils/todo';
import './todo-list.scss';
import { useCallback } from 'react';
import { useEditModeContext } from '../../context/edit-mode';

type TodoListProps = {
    className?: string,
    alwaysShowAddChild?: boolean,
    parentId?: TodoId,
    addTodo: AddTodoCallback,
    getTodos: GetTodosCallback,
    updateTodo: (todo: Todo) => void,
    deleteTodo: (todo: Todo) => void,
    reparentTodo: (id: TodoId, parentId: TodoId) => void
};

export const TodoList = ({
    className,
    alwaysShowAddChild,
    parentId,
    addTodo,
    getTodos,
    updateTodo,
    deleteTodo,
    reparentTodo
}: TodoListProps) => {
    const addChild = useCallback(() => {
        addTodo({});
    }, [addTodo]);
    const { editMode } = useEditModeContext();
    const items = getTodos(parentId);

    return (
        <ul className={cn(className, 'TodoList')}>
            {items.map(item => <TodoItem key={item.id} item={item} addTodo={addTodo} getTodos={getTodos} updateTodo={updateTodo} deleteTodo={deleteTodo} reparentTodo={reparentTodo}/>)}
            {alwaysShowAddChild && editMode && <li style={{display: 'flex'}}>
                <TodoAdd onClick={addChild}/>
            </li>}
        </ul>
    )
};
