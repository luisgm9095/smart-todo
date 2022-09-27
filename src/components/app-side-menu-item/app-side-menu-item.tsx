import cn from 'classnames';
import { useState } from 'react';
import { useEditModeContext } from '../../context/edit-mode';
import { useDraggable } from '../../hooks/use-draggable';
import { ReactComponent as DeleteIcon } from '../../trash.svg';

type AppSideMenuItemProps<T extends string> = {
    id: T,
    title: string,
    selectedItemId: T,
    onDelete: (id: T) => void,
    onSelect: (id: T) => void,
    onMove: (id: T, targetId: T) => void
};

export const AppSideMenuItem = <T extends string>({
    id,
    title,
    selectedItemId,
    onDelete,
    onSelect,
    onMove
}: AppSideMenuItemProps<T>) => {
    const { editMode } = useEditModeContext();
    const { onDragOver, onDragStart, onDrop } = useDraggable(id, 'app-side-menu-item', (key: T) => onMove(key, id));

    return (
        <li className={cn('AppSideMenu_item', {'AppSideMenu_item--selected': selectedItemId === id })} draggable
            onDragOver={onDragOver}
            onDragStart={onDragStart}
            onDrop={onDrop}>
            <label className='AppSideMenu_label' onClick={() => onSelect(id)}>{ title }</label>
            <div className='AppSideMenu_delete'>
                {editMode && selectedItemId === id && <DeleteIcon onClick={() => onDelete(id)}/>}
            </div>
        </li>
    );
}