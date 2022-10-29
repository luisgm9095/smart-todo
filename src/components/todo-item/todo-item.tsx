import { CSSProperties, MouseEvent, useCallback, useState } from 'react';
import cn from 'classnames';
import { useEditModeContext } from '../../context/edit-mode';
import { useEditTodoContext } from '../../context/edit-todo';
import { useDraggable } from '../../hooks/use-draggable';
import { TodoAdd } from '../todo-add/todo-add';
import { Checkbox } from '../checkbox/checkbox';
import { TodoItemTitle } from '../todo-item-title/todo-item-title';
import { ReactComponent as DeleteIcon } from '../../trash.svg';
import { ReactComponent as MoveIcon } from '../../menu.svg';
import { ReactComponent as CollapseIcon } from '../../collapse.svg';
import './todo-item.scss';
import { DRAG_KEY_TODO_ITEM } from '../../utils/drag-keys';

type TodoItemProps = {
    className?: string,
    item: Todo
};

const _DEFAULT_CALLBACK = () => void 0;

const TodoItem = ({
    className,
    item
}: TodoItemProps) => {
    const { updateTodo, deleteTodo, selectTodo } = useEditTodoContext(); 
    const { editMode } = useEditModeContext();
    const { title, id, checked, selected, collapsed, visible } = item;
    
    /// DRAGGING
    
    const onDragEnterCallback = useCallback(() => editMode && selectTodo(item), [editMode, selectTodo, item]);
    const { onDragOver, onDrop, onDragStart, onDragEnter, onDragLeave } = useDraggable(id, DRAG_KEY_TODO_ITEM, _DEFAULT_CALLBACK, onDragEnterCallback);
    
    const handleCheck = useCallback((event: MouseEvent) =>  {
        event.stopPropagation();
        updateTodo({
            ...item,
            checked: !checked
        });
    },[item]);

    const handleClickItem = (event: MouseEvent) => {
        event.stopPropagation();
        editMode && selectTodo(item);
    };

    const handleChangeTitle = useCallback((title: string) => {
        updateTodo({
            ...item,
            title
        });
    }, [item, updateTodo]);

    const handleClickDelete = useCallback((event: MouseEvent) => {
        event.stopPropagation();
        deleteTodo(item);
    }, [deleteTodo, item]);

    const handleClickCollapse = useCallback((event: MouseEvent) => {
        event.stopPropagation();
        updateTodo({
            ...item,
            collapsed: !item.collapsed
        });
    }, [updateTodo, item]);

    return visible ? (
            <div className={cn(className, 'TodoItem', { 'TodoItem--editable': editMode, 'TodoItem--selected': selected })} onClick={handleClickItem}>
            { editMode && selected &&
                <div className='TodoItem_panel'>
                    <TodoAdd mode='sibling' todoId={id}/>
                </div>
            }
            <div className='TodoItem_info' onDropCapture={onDrop} onDragOver={onDragOver} onDragEnter={onDragEnter} onDragLeave={onDragLeave}>
                <div className={cn('TodoItem_collapse', { 'TodoItem_collapse--collapsed': collapsed })}>
                    <CollapseIcon onClick={handleClickCollapse} />
                </div>
                <div className='TodoItem_info--group'>
                    <Checkbox checked={checked} onChange={handleCheck}/>
                    <TodoItemTitle title={title} onChange={handleChangeTitle} />
                </div>
                { editMode && 
                    <div className='TodoItem_move' draggable onDragStart={onDragStart}>
                        <MoveIcon />
                    </div> 
                }
                <div className='TodoItem_delete'>
                    { editMode && <DeleteIcon onClick={handleClickDelete} /> }
                </div>
            </div>
            { editMode && selected &&
                <div className='TodoItem_panel TodoItem_panel--indented'>    
                    <TodoAdd mode='child' todoId={id}/>
                </div>
            }
        </div>
    ) : null
}

export const renderTodo: TreeNodeRenderer<Todo> = (item) => <TodoItem item={item} />
