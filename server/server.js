const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

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
            message: "Unable to get all todos",
            error: e
        });
    });
});

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404)
            .json({
                status: "FAILED",
                message: "Invalid ID Given",
            });
    }

    Todo.findById({
        _id: id 
    }, '_id text completed completedAt')
    .then(doc => {
        if (!doc) {
            return res.status(404)
                .json({
                    status: "FAILED",
                    message: "Data not found",
                });
        }

        return res.json({
            status: "OK",
            data: doc,
        });
    }, e => {
        return res.status(400).json({
            status: "FAILED",
            message: "Unable to get a todo",
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