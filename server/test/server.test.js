const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const { todos, users, populateTodos, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('# GET /todos', () => {
    it('Should get all todos', done => {
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
    });
});

describe('# GET /todos/:id', () => {
    it('Should return todo doc', done => {
        let todo = todos[0];

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
    });

    it('Should return 404 if todo not found', done => {
        let id = new ObjectID().toHexString();
        
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('Should return 400 for non object ID given', done => {
        request(app)
            .get('/todos/123')
            .expect(400)
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
                    expect(todos.length).toBe(todos.length);
                    // expect(todos[0].text).toBe('Test todo text');

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
                    expect(todos.length).toBe(todos.length);

                    done();
                })
                .catch(err => done(err));
            });
    });
});

describe('# PATCH /todos/:id', () => {
    it('Should update a todo', done => {
        let todo = todos[0];

        request(app)
            .patch(`/todos/${todo._id}`)
            .send({
                text: 'Updated text',
                completed: true
            })
            .expect(200)
            .expect(res => {
                let body = res.body;

                expect(body.data.text).toBe('Updated text');
                expect(body.data.completed).toBe(true);
                expect(typeof body.data.completedAt).toBe('number');
            })
            .end(done);
    });

    it('Should clear completedAt when todo is not completed', done => {
        let todo = todos[1];

        request(app)
            .patch(`/todos/${todo._id}`)
            .send({
                completed: false
            })
            .expect(200)
            .expect(res => {
                let body = res.body;

                expect(body.data.completed).toBe(false);
                expect(body.data.completedAt).toBe(null);
            })
            .end(done);
    });
})

describe('# DELETE /todos/:id', () => {
    it('Should remove a todo', done => {
        let todo = todos[0];
        
        request(app)
            .delete(`/todos/${todo._id}`)
            .expect(200)
            .expect(res => {
                expect(res.body).toEqual({
                    status: "OK",
                    message: "Todo has been removed"
                });
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                Todo.findById(todo._id)
                    .then(doc => {
                        expect(doc).toBeFalsy();
                        done();
                    })
                    .catch(e => done(e));
            });
    });

    it('Should return 404 if todo not found', done => {
        let id = new ObjectID().toHexString();
        
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('Should return 400 if invalid Object ID Given', done => {
        request(app)
            .delete('/todos/123')
            .expect(400)
            .end(done);
    });
});