import cn from 'classnames';
import { useCallback, useState } from 'react';
import { useEditTodoContext } from '../../context/edit-todo';
import { useDraggable } from '../../hooks/use-draggable';
import { DRAG_KEY_TODO_ITEM } from '../../utils/drag-keys';
import './todo-add.scss';

type TodoAddMode = 'empty' | 'child' | 'sibling';

type TodoAddModeMap<T> = {
    [key in TodoAddMode]: T
}

type TodoAddProps = {
    className?: string,
    mode: TodoAddMode,
    todoId?: TodoId
}

export const TodoAdd = ({
    className,
    mode,
    todoId
}: TodoAddProps) => {
    const { addTodo, reparentTodo } = useEditTodoContext();
    const [dragging, setDragging] = useState(false);

    // HANDLE CLICK

    const addTodoEmpty = () => addTodo({});
    const addTodoChild = () => addTodo({ parentId: todoId });
    const addTodoSibling = () => addTodo({ siblingId: todoId });

    const handleClickMap: TodoAddModeMap<() => void> = {
        'empty': addTodoEmpty,
        'child': addTodoChild,
        'sibling': addTodoSibling
    };

    // HANDLE DRAG

    const reparentTodoEmpty = (otherId: TodoId) => reparentTodo({ id: otherId });
    const reparentTodoChild = (otherId: TodoId) => reparentTodo({ id: otherId, parentId: todoId });
    const reparentTodoSibling = (otherId: TodoId) => reparentTodo({ id: otherId, siblingId: todoId });

    const handleDropMap: TodoAddModeMap<(id: TodoId) => void> = {
        'empty': reparentTodoEmpty,
        'child': reparentTodoChild,
        'sibling': reparentTodoSibling
    };

    const onDropCallback = (otherId: TodoId) => {
        handleDropMap[mode](otherId);
        setDragging(false);
    };
    const onDragEnterCallback = useCallback(() => setDragging(true), []);
    const onDragLeaveCallback = useCallback(() => setDragging(false), []);
    const { onDragOver, onDrop, onDragEnter, onDragLeave } = useDraggable(todoId || '', DRAG_KEY_TODO_ITEM, onDropCallback, onDragEnterCallback, onDragLeaveCallback);

    return (
        <button className={cn(className, 'TodoAdd', { 'TodoAdd--drag': dragging })}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
            onClick={handleClickMap[mode]}>+</button>
    )
};
