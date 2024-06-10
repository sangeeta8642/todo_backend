const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connection of MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/todos').then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// Todo list Schema
const todoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
});

const Todo = mongoose.model('Todo', todoSchema);

// CRUD Routes

//Api to fetch the Todo list from database
app.get('/getTodos', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Api to insert the Todo task into database
app.post('/setTodos', async (req, res) => {
    const todo = new Todo({
        title: req.body.title,
        description: req.body.description,
    });

    try {
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Api to updating the todo task 
app.put('/updateTodos/:id', async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (todo == null) {
            return res.status(404).json({ message: 'Cannot find todo' });
        }

        if (req.body.title != null) {
            todo.title = req.body.title;
        }
        if (req.body.description != null) {
            todo.description = req.body.description;
        }
        if (req.body.completed != null) {
            todo.completed = req.body.completed;
        }

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

//Api to delete the todo task
app.delete('/deleteTodos/:id', async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).send();
        }
        res.send(todo);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(5000, () => {
    console.log(`Server is running`);
});
