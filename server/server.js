require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const { ObjectID } = require('mongodb');

const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate } =  require('./middleware/authenticate');

let app = express();

app.use(bodyParser.json());

// Todo
app.get('/todos', authenticate, (req, res) => {
    Todo.find({ userId: req.user._id }, 'id text completed completedAt').then(docs => {
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

app.post('/todos', authenticate, (req, res) => {
    let todo = new Todo({
        text: req.body.text,
        userId: req.user._id
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

app.get('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(400)
            .json({
                status: "FAILED",
                message: "Invalid ID Given",
            });
    }

    Todo.findById({
        _id: id,
        userId: req.user._id 
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

app.delete('/todos/:id', authenticate, (req, res) => {
    const id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(400)
            .json({
                status: "FAILED",
                message: "Invalid ID Given",
            });
    }

    Todo.findOneAndRemove({
        _id: id,
        userId: req.user._id
    })
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

app.patch('/todos/:id', authenticate, (req, res) => {
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

    Todo.findOneAndUpdate({
        _id: id,
        userId: req.user._id
    }, 
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

// User
app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user.toJson());
});

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    user.save()
        .then((user) => {
            return user.generateAuthToken();
        })
        .then((token) => {
            res.header('x-auth', token)
                .json({
                    status: "OK",
                    message: "New user added",
                    data: user.toJson()
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


// Auth 
app.post('/login', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);

    User.findByCredentials(body.email, body.password)
        .then((user) => {
            return user.generateAuthToken()
                .then((token) => {
                    res.header('x-auth', token)
                        .send({
                            status: "OK",
                            data: user,
                        });
                });
        })
        .catch((err) => {
            res.status(400)
                .send({
                    status: "FAILED",
                    message: err,
                });
        })
});

app.delete('/logout', authenticate, (req, res) => {
    req.user.removeToken(req.token)
        .then(() => {
            res.status(200)
                .send();   
        }, () => {
            res.status(400)
                .send();
        })
});

app.listen(3000, () => {
    console.log('Started on port 3000');
});

module.exports = { app };