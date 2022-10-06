import { useCallback, useEffect, useMemo, useState } from 'react';
import { EditModeProvider } from './context/edit-mode';
import { EditTodoProvider } from './context/edit-todo';
import { useTodo } from './hooks/use-todo';
import { ReactComponent as EditModeLogo } from './pencil.svg';
import { AppLogo } from './components/app-logo/app-logo';
import { useTodoList } from './hooks/use-todo-list';
import { AppSideMenu } from './components/app-side-menu/app-side-menu';
import { AppMenuIcon } from './components/app-menu-icon/app-menu-icon';
import { Tree } from './components/tree/tree';
import { TodoAdd } from './components/todo-add/todo-add';
import { useKeyPress } from './hooks/use-keypress';
import { renderTodo } from './components/todo-item/todo-item';
import cn from 'classnames';
import './App.scss';

export const App = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const { items, selectedItem, addItem, changeItem, deleteItem, selectItem, moveItem } = useTodoList();
  const { tree, addTodo, updateTodo, deleteTodo, selectTodo, reparentTodo } = useTodo(selectedItem.id);
  const [editMode, setEditMode] = useState(true);

  const handleClickMenu = useCallback(() => {
    setMenuVisible((prev) => !prev);
  }, []);

  const handleChangeTitle = useCallback((value: string) => {
    changeItem({
      ...selectedItem,
      title: value
    });
  }, [changeItem, selectedItem]);

  const handleClickTodoAdd = useCallback(() => addTodo({}), [addTodo])

  const editModeContextValue = useMemo(() => ({editMode}), [editMode]);
  const editTodoContextValue = useMemo(() => ({ addTodo, updateTodo, deleteTodo, selectTodo, reparentTodo }), [addTodo, updateTodo, deleteTodo, selectTodo, reparentTodo]);

  const keyPressedCreateNewTodo = useKeyPress('n', false, true);

  useEffect (() => {
    if(keyPressedCreateNewTodo) {
      handleClickTodoAdd();
    }
  }, [keyPressedCreateNewTodo]);
  
  return (
    <EditTodoProvider value={editTodoContextValue}>
      <EditModeProvider value={editModeContextValue}>
        <div className='App'>
          <div className='App_list'>
            <Tree tree={tree} renderComponent={renderTodo} memoized={true}/>
            { editMode && <TodoAdd onClick={handleClickTodoAdd}/> }
          </div>
        </div>
        <div className={cn('App_editmode', {'App_editmode--active':editMode})} onClick={() => setEditMode((prev) => !prev)}>
          <EditModeLogo />
        </div>
        <AppLogo onChange={handleChangeTitle} value={selectedItem.title}/>
        <AppMenuIcon onClick={handleClickMenu}/>
        <AppSideMenu visible={menuVisible} items={items} onAddItem={addItem} onClose={handleClickMenu} onDelete={deleteItem} onSelect={selectItem} onMove={moveItem} selectedItemId={selectedItem.id} />
      </EditModeProvider>
    </EditTodoProvider>
  );
};
