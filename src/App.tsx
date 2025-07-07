import { useState } from 'react'
import React from 'react';
import './App.css'

function App() {
  const [tasks, setTasks] = useState<{ id: number; text: string; completed: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: input.trim(), completed: false },
    ]);
    setInput('');
  };

  const handleToggle = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleClearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const filteredTasks =
    filter === 'all'
      ? tasks
      : filter === 'active'
      ? tasks.filter(task => !task.completed)
      : tasks.filter(task => task.completed);

  const remaining = tasks.filter(task => !task.completed).length;

  return (
    <div className="todo-app">
      <h1>ToDo App</h1>
      <form onSubmit={handleAddTask} className="todo-form">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Введите новую задачу"
          className="todo-input"
        />
        <button type="submit" className="add-btn">Добавить</button>
      </form>
      <div className="filters">
        <button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>Все</button>
        <button onClick={() => setFilter('active')} className={filter === 'active' ? 'active' : ''}>Невыполненные</button>
        <button onClick={() => setFilter('completed')} className={filter === 'completed' ? 'active' : ''}>Выполненные</button>
      </div>
      <ul className="todo-list">
        {filteredTasks.map(task => (
          <li key={task.id} className={task.completed ? 'completed' : '' +'task'}>
            <label>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggle(task.id)}
              />
              {task.text}
            </label>
          </li>
        ))}
      </ul>
      <div className="todo-footer">
        <span className='remaining-tasks'>{remaining?`Осталось задач ${remaining}`:'Задачи выполнены!'}</span>
        <button onClick={handleClearCompleted} className="clear-btn">Очистить выполненные</button>
      </div>
    </div>
  );
}

export default App
