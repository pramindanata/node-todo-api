const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');

const {User} = require('./models/user');
const {Todo} = require('./models/todo');

let app = express();

app.use(bodyParser.json());

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
            content: e
        })
    });
});

app.listen(3000, () => {
    console.log('Started on port 3000');
})