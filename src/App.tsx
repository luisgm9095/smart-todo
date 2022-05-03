import { useState } from 'react';
import cn from 'classnames';
import { TodoList } from './components/todo-list/todo-list';
import { EditModeProvider } from './context/edit-mode';
import { useTodo } from './hooks/use-todo';
import { ReactComponent as EditModeLogo } from './pencil.svg';
import './App.scss';
import { SelectTodoProvider } from './context/select-todo';
import { TodoId } from './utils/todo';

export const App = () => {
  const { addTodo, getTodos, updateTodo, deleteTodo } = useTodo('testlist');
  const [editMode, setEditMode] = useState(true);
  const [selectedTodoId, setSelectedTodoId] = useState<TodoId>();

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
      </EditModeProvider>
    </SelectTodoProvider>
  );
};
