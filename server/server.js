const express = require('express');
const bodyParser = require('body-parser');

const { mongoose } = require('./db/mongoose');

const { User } = require('./models/user');
const { Todo } = require('./models/todo');

let app = express();

app.use(bodyParser.json());

app.get('/todos', (req, res) => {
    Todo.find({}, 'id text completed completedAt').then(docs => {
        res.json({
            status: "OK",
            data: docs,
        });
    }, e => {
        res.status(400).json({
            status: "FAILED",
            message: "Unable to fetch all todos",
            error: e
        });
    });
});

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    todo.save().then(() => {
        res.json({
            status: "OK",
            message: "New todo added"
        });
    }, e => {
        res.status(400).json({
            status: "FAILED",
            message: "Unable to add new todo",
            error: e
        })
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = { app };