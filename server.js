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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 