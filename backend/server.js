const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// In-memory task storage
let tasks = [];
let nextId = 1;

// In-memory user storage
let users = [];
let nextUserId = 1;

// Route to add a new task
app.post('/tasks', (req, res) => {
  const { title, description, dueDate } = req.body;
  if (!title || !dueDate) {
    return res.status(400).json({ error: 'Title and due date are required.' });
  }
  const newTask = {
    id: nextId++,
    title,
    description: description || '',
    dueDate,
    completed: false,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// (Optional) Route to get all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// Route to mark a task as completed/incomplete
app.patch('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  const task = tasks.find(t => t.id === Number(id));
  if (!task) {
    return res.status(404).json({ error: 'Task not found.' });
  }
  if (typeof completed === 'boolean') {
    task.completed = completed;
  }
  res.json(task);
});

// Route to delete a task
app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const index = tasks.findIndex(t => t.id === Number(id));
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }
  const deleted = tasks.splice(index, 1)[0];
  res.json(deleted);
});

// User registration
app.post('/auth/signup', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'Username already exists.' });
  }
  const newUser = { id: nextUserId++, username, password };
  users.push(newUser);
  res.status(201).json({ id: newUser.id, username: newUser.username });
});

// User login
app.post('/auth/signin', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }
  res.json({ id: user.id, username: user.username });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 