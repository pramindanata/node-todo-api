const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

const todos = [
    {
        completed: false,
        completedAt: null,
        _id: new ObjectID(),
        text: "Buy some fruits"
    },
    {
        completed: false,
        completedAt: null,
        _id: new ObjectID(),
        text: "Have lunch"
    },
    {
        completed: false,
        completedAt: null,
        _id: new ObjectID(),
        text: "Go outside"
    }
];

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [
    {
        _id: userOneId,
        email: 'pramindanata.eksa@gmail.com',
        password: 'userOnePass',
        tokens: [
            {
                access: 'auth',
                token: jwt.sign({
                    _id: userOneId,
                    access: 'auth'
                }, 'abc123').toString()
            }
        ]
    },
    {
        _id: userTwoId,
        email: 'eksa@gmail.com',
        password: 'userTwoPass',
        tokens: []
    }
]

const populateTodos = (done) => {
    Todo.remove({})
        .then(() => {
            return Todo.insertMany(todos)
        })
        .then(() => done());
};
const populateUsers = (done) => {
    User.remove({})
        .then(() => {
            let userOne = new User(users[0]).save();
            let userTwo = new User(users[1]).save();

            return Promise.all([userOne, userTwo]);x
        })
        .then(() => done()); 
}

module.exports = { todos, users, populateTodos, populateUsers } ;