const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {
    useNewUrlParser: true
});

let Todo = mongoose.model('Todo', {
    text: {
        type: String
    },
    completed: {
        type: Boolean
    },
    completedAt: {
        type: Number
    }
});

let newTodo = new Todo({
    text: "Clean my room",
    completed: false
});

newTodo.save()
    .then(() => {
        console.log('New todo added');
    }, e => {
        console.log('Unable to add new todo', e);
    })

Todo.create({
    text: "Buy some foods",
    completed: true,
    completedAt: 1234122312,
}).then(() => {
    console.log('New todo added');
}, e => {
    console.log('Unable to add new todo', e);
})