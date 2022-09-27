import { MouseEvent, useCallback } from 'react';
import cn from 'classnames';
import { AddTodoCallback, GetTodosCallback, Todo, TodoId } from '../../utils/todo';
import './todo-item.scss';
import { Checkbox } from '../checkbox/checkbox';
import { TodoAdd } from '../todo-add/todo-add';
import { TodoList } from '../todo-list/todo-list';
import { useEditModeContext } from '../../context/edit-mode';
import { useSelectTodoContext } from '../../context/select-todo';
import { TodoItemTitle } from '../todo-item-title/todo-item-title';
import { ReactComponent as DeleteIcon } from '../../trash.svg';
import { ReactComponent as MoveIcon } from '../../menu.svg';
import { useDraggable } from '../../hooks/use-draggable';

type TodoItemProps = {
    className?: string,
    item: Todo,
    addTodo: AddTodoCallback,
    getTodos: GetTodosCallback,
    updateTodo: (todo: Todo) => void,
    deleteTodo: (todo: Todo) => void,
    reparentTodo: (id: TodoId, parentId: TodoId) => void,
};

export const TodoItem = ({
    className,
    item,
    addTodo,
    getTodos,
    updateTodo,
    deleteTodo,
    reparentTodo
}: TodoItemProps) => {
    const { editMode } = useEditModeContext();
    const { selectedTodoId, setSelectedTodoId } = useSelectTodoContext();
    const { onDragOver, onDrop, onDragStart } = useDraggable(item.id, 'todo-item', (id: TodoId) => reparentTodo(id, item.id));
    const { title, id, checked } = item;
    const children = getTodos(id);
    const selected = selectedTodoId === id;

    const handleCheck = (event: MouseEvent) =>  {
        event.stopPropagation();
        updateTodo({
            ...item,
            checked: !item.checked
        });
    }

    const addChild = useCallback(() => {
        addTodo({ parentId: id });
    }, [id, addTodo]);

    const addSiblingTop = useCallback(() => {
        addTodo({ siblingId: id });
    }, [id, addTodo]);

    const handleClickItem = (event: MouseEvent) => {
        event.stopPropagation();
        setSelectedTodoId(id);
    };

    const handleChangeTitle = (title: string) => {
        updateTodo({
            ...item,
            title
        });
    };

    const handleClickDelete = (event: MouseEvent) => {
        event.stopPropagation();
        deleteTodo(item);
    };

    return (
        <li className={cn(className, 'TodoItem', { 'TodoItem--editable': editMode, 'TodoItem--selected': selected })}
            onClick={handleClickItem}>
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
                    { editMode && <DeleteIcon onClick={handleClickDelete} />}
                </div>
            </div>
            {!!children?.length && <TodoList className='TodoItem_children' addTodo={addTodo} getTodos={getTodos} updateTodo={updateTodo} deleteTodo={deleteTodo} parentId={id} reparentTodo={reparentTodo} />}
            { editMode && selected &&
                <div className='TodoItem_panel TodoItem_panel--indented'>    
                    <TodoAdd onClick={addChild}/>
                </div>
            }
        </li>
    )
};
