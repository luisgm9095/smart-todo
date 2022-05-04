import cn from 'classnames';
import { TodoList, TodoListId } from '../../utils/todo-list';
import { useEditModeContext } from '../../context/edit-mode';
import { ReactComponent as DeleteIcon } from '../../trash.svg';
import { ReactComponent as BackIcon } from '../../menu.svg';
import './app-side-menu.scss';

type AppSideMenuProps = {
    visible: boolean,
    items: TodoList[],
    selectedItemId: TodoListId,
    onAddItem: () => void,
    onClose: () => void,
    onDelete: (id: TodoListId) => void,
    onSelect: (id: TodoListId) => void
};

export const AppSideMenu = ({
    visible,
    items,
    selectedItemId,
    onAddItem,
    onClose,
    onDelete,
    onSelect
}: AppSideMenuProps) => {
    const { editMode } = useEditModeContext();

    return (
        <div className={ cn('AppSideMenu', { 'AppSideMenu--visible': visible})}>
            <ul className='AppSideMenu_list'>
                <li className='AppSideMenu_back' onClick={onClose}>
                    <div className='AppSideMenu_backIcon'>
                        <BackIcon />
                    </div>
                </li>
                { items.map(({ id, title }) => <li key={ id } className={cn('AppSideMenu_item', {'AppSideMenu_item--selected': selectedItemId === id })}>
                    <label className='AppSideMenu_label' onClick={() => onSelect(id)}>{ title }</label>
                    <div className='AppSideMenu_delete'>
                        {editMode && selectedItemId === id && <DeleteIcon onClick={() => onDelete(id)}/>}
                    </div>
                </li>) }
                <li className='AppSideMenu_add' onClick={onAddItem}>+</li>
            </ul>
        </div>
    );
};
