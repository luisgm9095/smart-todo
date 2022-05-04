import { useCallback, useState } from 'react';
import cn from 'classnames';
import { TodoList } from './components/todo-list/todo-list';
import { EditModeProvider } from './context/edit-mode';
import { useTodo } from './hooks/use-todo';
import { ReactComponent as EditModeLogo } from './pencil.svg';
import './App.scss';
import { SelectTodoProvider } from './context/select-todo';
import { TodoId } from './utils/todo';
import { AppLogo } from './components/app-logo/app-logo';
import { useTodoList } from './hooks/use-todo-list';
import { AppSideMenu } from './components/app-side-menu/app-side-menu';
import { AppMenuIcon } from './components/app-menu-icon/app-menu-icon';

export const App = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { items, selectedItem, addItem, changeItem, deleteItem, selectItem } = useTodoList();
  const { addTodo, getTodos, updateTodo, deleteTodo } = useTodo(selectedItem.id);
  const [editMode, setEditMode] = useState(true);
  const [selectedTodoId, setSelectedTodoId] = useState<TodoId>();

  const handleClickMenu = useCallback(() => {
    setMenuVisible((prev) => !prev);
  }, []);

  const handleChangeTitle = (value: string) => {
    changeItem({
      ...selectedItem,
      title: value
    });
  };

  return (
    <SelectTodoProvider value={{ selectedTodoId, setSelectedTodoId }}>
      <EditModeProvider value={{editMode}}>
        <div className="App">
          <div className="App_list">
            <TodoList alwaysShowAddChild={true} addTodo={addTodo} getTodos={getTodos} updateTodo={updateTodo} deleteTodo={deleteTodo} />
          </div>
        </div>
        <div className={cn('App_editmode', {'App_editmode--active':editMode})} onClick={() => setEditMode((prev) => !prev)}>
          <EditModeLogo />
        </div>
        <AppLogo onChange={handleChangeTitle} value={selectedItem.title}/>
        <AppMenuIcon onClick={handleClickMenu}/>
        <AppSideMenu visible={menuVisible} items={items} onAddItem={addItem} onClose={handleClickMenu} onDelete={deleteItem} onSelect={selectItem} selectedItemId={selectedItem.id} />
      </EditModeProvider>
    </SelectTodoProvider>
  );
};
