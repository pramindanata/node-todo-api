const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../models/todo');

const todos = [
    {
        "completed": false,
        "completedAt": null,
        "_id": "5b6564693c10dd27c428e511",
        "text": "Buy some fruits"
    },
    {
        "completed": false,
        "completedAt": null,
        "_id": "5b6564723c10dd27c428e512",
        "text": "Have lunch"
    },
    {
        "completed": false,
        "completedAt": null,
        "_id": "5b6564793c10dd27c428e513",
        "text": "Go outside"
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
                            data: todos
                        });
                    })
                    .end(done);
            }, e => {
                throw e;
            });
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