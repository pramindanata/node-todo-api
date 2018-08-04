const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/TodoApp', {
    useNewUrlParser: true
});

let Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

let User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minLength: 1,
        trim: true
    }
});

User.create({
    email: "pramindanata.eksa@gmail.com"
})
.then(doc => {
    console.log('New user added');
    console.log(doc);
}, e => {
    console.log(e);
})

// let newTodo = new Todo({
//     text: "      aawdwad",
//     completed: false
// });

// newTodo.save()
//     .then(doc => {
//         console.log('New todo added');
//         console.log(doc);
//     }, e => {
//         console.log('Unable to add new todo');
//         console.log(JSON.stringify(e, undefined, 2))
//     })

// Todo.create({
//     text: "Buy some foods",
//     completed: true,
//     completedAt: 1234122312,
// }).then(() => {
//     console.log('New todo added');
// }, e => {
//     console.log('Unable to add new todo', e);
// })