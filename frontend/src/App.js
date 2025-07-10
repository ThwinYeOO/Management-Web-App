import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate
} from 'react-router-dom';

const API_URL = 'http://localhost:4000/tasks';
const AUTH_URL = 'http://localhost:4000/auth';

function Navbar({ user, onSignOut }) {
  return (
    <nav className="navbar">
      <div className="navbar-logo">Task Manager</div>
      <ul className="navbar-links">
        <li><Link to="/">Home</Link></li>
        {user ? (
          <>
            <li style={{color:'#fff',fontWeight:600}}>Hi, {user.username}</li>
            <li><button className="signout-btn" onClick={onSignOut}>Sign Out</button></li>
          </>
        ) : (
          <li><Link to="/signin">Sign In/Sign Up</Link></li>
        )}
        <li><Link to="/contact">Contact Us</Link></li>
        <li><Link to="/about">About Us</Link></li>
      </ul>
    </nav>
  );
}

function About() {
  return (
    <div className="about-page">
      <h2>About Us</h2>
      <p>
        <b>Task Manager Web App</b> is a simple and intuitive tool designed for anyone who wants to organize their daily tasks efficiently. Whether you are a student, a professional, or just someone who likes to stay organized, this app helps you:
      </p>
      <ul>
        <li>Add, view, and manage your tasks</li>
        <li>Set due dates and descriptions for each task</li>
        <li>Mark tasks as completed or incomplete</li>
        <li>Delete tasks you no longer need</li>
      </ul>
      <p>
        This web app is built with modern technologies (React & Node.js) and is perfect for personal productivity, small teams, or anyone who wants a lightweight, no-fuss task management solution.
      </p>
      <p>
        <b>Our Mission:</b> To make task management simple, accessible, and effective for everyone.
      </p>
    </div>
  );
}

function AuthPage({ onAuth, isSignIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const url = isSignIn ? `${AUTH_URL}/signin` : `${AUTH_URL}/signup`;
      const res = await axios.post(url, { username, password });
      onAuth(res.data);
      setLoading(false);
      navigate('/');
    } catch (err) {
      setLoading(false);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Something went wrong.');
      }
    }
  };

  return (
    <div className="App section-card" style={{maxWidth:400}}>
      <h2>{isSignIn ? 'Sign In' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>{loading ? 'Please wait...' : (isSignIn ? 'Sign In' : 'Sign Up')}</button>
      </form>
      {error && <div className="error-msg">{error}</div>}
      <div style={{marginTop:12}}>
        {isSignIn ? (
          <>Don't have an account? <Link to="/signup">Sign Up</Link></>
        ) : (
          <>Already have an account? <Link to="/signin">Sign In</Link></>
        )}
      </div>
    </div>
  );
}

function Home({ tasks, loading, handleAddTask, title, setTitle, description, setDescription, dueDate, setDueDate, toggleComplete, deleteTask, user }) {
  return (
    <div className="App">
      {user ? null : <div className="error-msg" style={{marginBottom:16}}>Sign in to save your tasks!</div>}
      <form onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
        />
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          required
        />
        <button type="submit">Add Task</button>
      </form>
      <h2 style={{textAlign: 'center', marginBottom: '1.2rem', marginTop: 0}}>Tasks</h2>
      {loading ? (
        <p className="empty-state">Loading...</p>
      ) : tasks.length === 0 ? (
        <div className="empty-state">No tasks yet. Add your first task!</div>
      ) : (
        <ul className="tasks-list">
          {tasks.map(task => (
            <li key={task.id} className={`task-card${task.completed ? ' completed' : ''}`}>
              <input
                type="checkbox"
                className="checkbox"
                checked={task.completed}
                onChange={() => toggleComplete(task.id, task.completed)}
              />
              <div className="task-info">
                <div className="task-title">{task.title}</div>
                {task.description && <div className="task-desc">{task.description}</div>}
                <div className="task-date">Due: {task.dueDate}</div>
              </div>
              <div className="task-actions">
                <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Fetch tasks from backend
  useEffect(() => {
    axios.get(API_URL)
      .then(res => setTasks(res.data))
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title || !dueDate) return;
    try {
      const res = await axios.post(API_URL, {
        title,
        description,
        dueDate,
      });
      setTasks([...tasks, res.data]);
      setTitle('');
      setDescription('');
      setDueDate('');
    } catch (err) {
      alert('Failed to add task');
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      const res = await axios.patch(`${API_URL}/${id}`, { completed: !completed });
      setTasks(tasks.map(task => task.id === id ? res.data : task));
    } catch (err) {
      alert('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      alert('Failed to delete task');
    }
  };

  const handleAuth = (userObj) => {
    setUser(userObj);
  };

  const handleSignOut = () => {
    setUser(null);
  };

  return (
    <Router>
      <Navbar user={user} onSignOut={handleSignOut} />
      <Routes>
        <Route path="/" element={<Home
          tasks={tasks}
          loading={loading}
          handleAddTask={handleAddTask}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          dueDate={dueDate}
          setDueDate={setDueDate}
          toggleComplete={toggleComplete}
          deleteTask={deleteTask}
          user={user}
        />} />
        <Route path="/about" element={<About />} />
        <Route path="/signin" element={<AuthPage onAuth={handleAuth} isSignIn={true} />} />
        <Route path="/signup" element={<AuthPage onAuth={handleAuth} isSignIn={false} />} />
        <Route path="/contact" element={<div className="App section-card"><h2>Contact Us</h2><p>Contact form coming soon...</p></div>} />
      </Routes>
    </Router>
  );
}

export default App;
