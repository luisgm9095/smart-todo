import cn from 'classnames';
import { AppSideMenuItem } from '../app-side-menu-item/app-side-menu-item';
import { TodoList, TodoListId } from '../../utils/todo-list';
import { ReactComponent as BackIcon } from '../../menu.svg';
import './app-side-menu.scss';

type AppSideMenuProps = {
    visible: boolean,
    items: TodoList[],
    selectedItemId: TodoListId,
    onAddItem: () => void,
    onClose: () => void,
    onDelete: (id: TodoListId) => void,
    onSelect: (id: TodoListId) => void,
    onMove: (id: TodoListId, targetId: TodoListId) => void
};

export const AppSideMenu = ({
    visible,
    items,
    selectedItemId,
    onAddItem,
    onClose,
    onDelete,
    onSelect,
    onMove
}: AppSideMenuProps) => (
    <div className={ cn('AppSideMenu', { 'AppSideMenu--visible': visible})}>
        <ul className='AppSideMenu_list'>
            <li className='AppSideMenu_back' onClick={onClose}>
                <div className='AppSideMenu_backIcon'>
                    <BackIcon />
                </div>
            </li>
            { 
                items.map(({ id, title }) =>
                    <AppSideMenuItem 
                        key={id} 
                        id={id}
                        title={title}
                        selectedItemId={selectedItemId}
                        onDelete={onDelete}
                        onSelect={onSelect}
                        onMove={onMove}/>) 
            }
            <li className='AppSideMenu_add' onClick={onAddItem}>+</li>
        </ul>
    </div>
);
