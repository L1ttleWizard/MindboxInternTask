import { it, expect, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';


const addTask = async (text: string) => {
  const user = userEvent.setup();
  const input = screen.getByPlaceholderText(/введите новую задачу/i);
  const addBtn = screen.getByRole('button', { name: /добавить/i });
  
  await user.clear(input);
  await user.type(input, text);
  await user.click(addBtn);
  
  
  return screen.getByText(text);
};

describe('ToDo App', () => {
  it('добавляет новую задачу в список', async () => {
    render(<App />);
    const newTask = await addTask('Моя новая задача');
    expect(newTask).toBeInTheDocument();
  });


  it('отмечает задачу как выполненную и обратно', async () => {
    const user = userEvent.setup();
    render(<App />);
    await addTask('Задача для переключения');


    const checkbox = screen.getByRole('checkbox', { name: /задача для переключения/i });
    
    expect(checkbox).not.toBeChecked();
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });


  it('фильтрует задачи по статусу', async () => {
    const user = userEvent.setup();
    render(<App />);


    await addTask('Активная задача');
    await addTask('Выполненная задача');
    
    const checkboxToComplete = screen.getByRole('checkbox', { name: /выполненная задача/i });
    await user.click(checkboxToComplete);


    await user.click(screen.getByRole('button', { name: /невыполненные/i }));
   
    expect(screen.getByText('Активная задача')).toBeInTheDocument();
    expect(screen.queryByText('Выполненная задача')).not.toBeInTheDocument();
  
    await user.click(screen.getByRole('button', { name: /^выполненные$/i }));
    expect(screen.getByText('Выполненная задача')).toBeInTheDocument();
    expect(screen.queryByText('Активная задача')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^все$/i }));
    expect(screen.getByText('Активная задача')).toBeInTheDocument();
    expect(screen.getByText('Выполненная задача')).toBeInTheDocument();
  });

 
  it('отображает корректное количество оставшихся задач', async () => {
    const user = userEvent.setup();
    render(<App />);
    
 
    expect(screen.getByText(/осталось задач: 0/i)).toBeInTheDocument();
    
    await addTask('Еще одна активная');
    expect(screen.getByText(/осталось задач: 1/i)).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox', { name: /еще одна активная/i });
    await user.click(checkbox);
    expect(screen.getByText(/осталось задач: 0/i)).toBeInTheDocument();
  });

  
  it('очищает выполненные задачи', async () => {
    const user = userEvent.setup();
    render(<App />);
    await addTask('Задача на удаление');

    
    const checkbox = screen.getByRole('checkbox', { name: /задача на удаление/i });
    await user.click(checkbox);
    expect(screen.getByText('Задача на удаление')).toBeInTheDocument();
    

    const clearBtn = screen.getByRole('button', { name: /очистить выполненные/i });
    await user.click(clearBtn);

    expect(screen.queryByText('Задача на удаление')).not.toBeInTheDocument();
    expect(screen.queryByText('Изучить React')).not.toBeInTheDocument(); 
  });
});