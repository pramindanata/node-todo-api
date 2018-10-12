require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { Todo } = require('./models/todo');
const { User } = require('./models/user');

let app = express();

app.use(bodyParser.json());

// Todo
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

app.get('/todos/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(400)
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

app.delete('/todos/:id', (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(400)
            .json({
                status: "FAILED",
                message: "Invalid ID Given",
            });
    }

    Todo.findByIdAndRemove(id)
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
                message: "Todo has been removed",
            });
        }, e => {
            return res.status(400).json({
                status: "FAILED",
                message: "Unable to get a todo",
                error: e
            });
        });
});

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, [
        'text',
        'completed'
    ]);

    if (!ObjectID.isValid(id)) {
        return res.status(400)
            .json({
                status: "FAILED",
                message: "Invalid ID Given",
            });
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, 
        { 
            $set: body 
        }, 
        {
            fields: '_id text completed completedAt',
            new: true
        })
        .then(doc => {
            if (!doc) {
                return res.status(404)
                    .json({
                        status: "FAILED",
                        message: "Data not found",
                    }); 
            }

            res.json({
                status: "OK",
                data: doc,
                message: "Todo has been updated"
            });
        })
        .catch(err => {
            res.status(400)
                .json({
                    status: "FAILED",
                    message: "Unable to update a todo",
                    error: err
                })
        });
});

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User({
        email: body.email,
        password: body.password
    })

    user.save()
        .then(() => {
            res.json({
                status: "OK",
                message: "New user added"
            });
        })
        .catch((e) => {
            res.status(400).json({
                status: "FAILED",
                message: "Unable to add new user",
                error: e
            })
        });

});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = { app };