import React, { useState } from 'react';
import './App.css';

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState([]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title || !dueDate) return;
    const newTask = {
      id: Date.now(),
      title,
      description,
      dueDate,
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setTitle('');
    setDescription('');
    setDueDate('');
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="App" style={{ maxWidth: 500, margin: '2rem auto', padding: 20 }}>
      <h1>Task Manager</h1>
      <form onSubmit={handleAddTask} style={{ marginBottom: 24 }}>
        <div>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 8 }}
          />
        </div>
        <div>
          <textarea
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ width: '100%', marginBottom: 8 }}
          />
        </div>
        <div>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            required
            style={{ width: '100%', marginBottom: 8 }}
          />
        </div>
        <button type="submit">Add Task</button>
      </form>
      <h2>Tasks</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{ marginBottom: 12, border: '1px solid #ccc', padding: 12, borderRadius: 6, background: task.completed ? '#e0ffe0' : '#fff' }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task.id)}
              style={{ marginRight: 8 }}
            />
            <strong style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</strong> <br />
            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.description}</span> <br />
            <small>Due: {task.dueDate}</small>
            <button onClick={() => deleteTask(task.id)} style={{ float: 'right', background: '#ffdddd', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
