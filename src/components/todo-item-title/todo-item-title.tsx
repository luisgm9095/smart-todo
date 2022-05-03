import { ChangeEvent, MouseEvent, useState } from 'react';
import cn from 'classnames';
import { useEditModeContext } from '../../context/edit-mode';
import './todo-item-title.scss';

type TodoItemTitleProps = {
    title: string,
    onChange: (value: string) => void
}

export const TodoItemTitle = ({
    title,
    onChange
}: TodoItemTitleProps) => {
    const { editMode } = useEditModeContext();
    const [editing, setEditing] = useState(false);
    const [editedValue, setEditedValue] = useState(title);

    const handleClickLabel = (event: MouseEvent) => {
        if(editMode) {
            event.stopPropagation();
            setEditing(true);
        }
    }

    const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        setEditedValue(event.target.value);
    }

    const handleBlurInput = () => {
        setEditing(false);
        onChange(editedValue);
    }

    return editing 
        ? <input className='TodoItemTitle_input' autoFocus type='text' value={editedValue} onChange={handleChangeInput} onBlur={handleBlurInput}/>
        : <label title={title} className={cn('TodoItemTitle_label',{ 'TodoItemTitle_label--editable': editMode})} onClick={handleClickLabel}>{ title }</label>
}