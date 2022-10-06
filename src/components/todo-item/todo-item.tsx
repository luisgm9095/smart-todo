import { MouseEvent, useCallback } from 'react';
import cn from 'classnames';
import { useEditModeContext } from '../../context/edit-mode';
import { useEditTodoContext } from '../../context/edit-todo';
import { useDraggable } from '../../hooks/use-draggable';
import { TodoAdd } from '../todo-add/todo-add';
import { Checkbox } from '../checkbox/checkbox';
import { TodoItemTitle } from '../todo-item-title/todo-item-title';
import { ReactComponent as DeleteIcon } from '../../trash.svg';
import { ReactComponent as MoveIcon } from '../../menu.svg';
import './todo-item.scss';

type TodoItemProps = {
    className?: string,
    item: Todo
};

const TodoItem = ({
    className,
    item
}: TodoItemProps) => {
    const { title, id, checked, selected } = item;
    const { addTodo, updateTodo, deleteTodo, selectTodo, reparentTodo } = useEditTodoContext(); 
    const { editMode } = useEditModeContext();
    const onDropCallback = useCallback((otherId: TodoId) => reparentTodo({ id: otherId, parentId: id }), [id, reparentTodo]);
    const { onDragOver, onDrop, onDragStart } = useDraggable(id, 'todo-item', onDropCallback);

    const handleCheck = useCallback((event: MouseEvent) =>  {
        event.stopPropagation();
        updateTodo({
            ...item,
            checked: !checked
        });
    },[item]);

    const addChild = useCallback(() => {
        addTodo({ parentId: id });
    }, [id, addTodo]);

    const addSiblingTop = useCallback(() => {
        addTodo({ siblingId: id });
    }, [id, addTodo]);

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

    return (
            <div className={cn(className, 'TodoItem', { 'TodoItem--editable': editMode, 'TodoItem--selected': selected })} onClick={handleClickItem}>
            { editMode && selected &&
                <div className='TodoItem_panel'>
                    <TodoAdd onClick={addSiblingTop}/>
                </div>
            }
            <div className='TodoItem_info'>
                <div className='TodoItem_info--group'>
                    <Checkbox checked={checked} onChange={handleCheck}/>
                    <TodoItemTitle title={title} onChange={handleChangeTitle} />
                </div>
                { editMode && 
                    <div className='TodoItem_move' draggable onDragStart={onDragStart} onDrop={onDrop} onDragOver={onDragOver}>
                        <MoveIcon />
                    </div> 
                }
                <div className='TodoItem_delete'>
                    { editMode && <DeleteIcon onClick={handleClickDelete} /> }
                </div>
            </div>
            { editMode && selected &&
                <div className='TodoItem_panel TodoItem_panel--indented'>    
                    <TodoAdd onClick={addChild}/>
                </div>
            }
        </div>
    )
}

export const renderTodo: TreeNodeRenderer<Todo> = (item) => <TodoItem item={item} />
