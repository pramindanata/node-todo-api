const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

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

beforeEach(done => {
    Todo.remove({}).then(() => done());
});

describe('# GET /todos', () => {
    it('Should get all todos', done => {
        Todo.insertMany(todos)
            .then(() => {
                request(app)
                    .get('/todos')
                    .expect(200)
                    .expect(res => {
                        expect(res.body).toEqual({
                            status: "OK",
                            data: todos.map(todo => {
                                return {
                                    completed: todo.completed,
                                    completedAt: todo.completedAt,
                                    _id: todo._id.toHexString(),
                                    text: todo.text
                                }
                            })
                        });
                    })
                    .end(done);
            }, e => {
                throw e;
            });
    });
});

describe('# GET /todos:id', () => {
    let todo = todos[0];

    it('Should return todo doc', done => {
        Todo.create(todo)
            .then(() => {
                request(app)
                    .get(`/todos/${todo._id}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body).toEqual({
                            status: "OK",
                            data: {
                                completed: todo.completed,
                                completedAt: todo.completedAt,
                                _id: todo._id.toHexString(),
                                text: todo.text
                            }
                        });
                    }) 
                    .end(done);
            }, e => {
                throw e;
            });
    });

    it('Should return 404 if todo not found', done => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done);
    });

    it('Should return 404 for non object ID given', done => {
        let id = new ObjectID().toHexString();
        
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});

describe('# POST /todos', () => {
    it('Should create a new todo', done => {
        let text = "Test todo text";

        request(app)
            .post('/todos')
            .send({
                text
            })
            .expect(200)
            .expect(res => {
                expect(res.body)
                    .toEqual({
                        status: "OK",
                        message: "New todo added"
                    });
            })
            .end((err, res) => {
                if (err) return done(err);

                Todo.find().then(todos => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe('Test todo text');

                    done();
                })
                .catch(err => done(err));
            });
    });

    it('Should not create todo when invalid body data given', done => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end(err => {
                if (err) return done(err);

                Todo.find().then(todos => {
                    expect(todos.length).toBe(0);

                    done();
                })
                .catch(err => done(err));
            });
    });
});