import { ChangeEvent, CSSProperties, useEffect, useState } from 'react';
import { useEditModeContext } from '../../context/edit-mode';
import './todo-item-title.scss';

type TodoItemTitleProps = {
    title: string,
    style?: CSSProperties,
    onChange: (value: string) => void,
}

export const TodoItemTitle = ({
    title,
    style,
    onChange
}: TodoItemTitleProps) => {
    const { editMode } = useEditModeContext();
    const [editedValue, setEditedValue] = useState(title);

    const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        setEditedValue(event.target.value);
    }

    const handleBlurInput = () => {
        onChange(editedValue);
    }

    useEffect(() => {
        setEditedValue(title);
    }, [title])

    return <input title={title} disabled={!editMode} className='TodoItemTitle' autoFocus type='text' value={editedValue} onChange={handleChangeInput} onBlur={handleBlurInput} style={style}/>
}