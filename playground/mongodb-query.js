const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');

let id = '6b6964c657a0541a9883268e';

Todo.find({
    _id: id
})
.then(docs => {
    console.log(docs);
});

Todo.findOne({
    _id: id
})
.then(doc => {
    console.log(doc);
});

Todo.findById(id)
.then(doc => {
    console.log(doc);
}, e => console.log(e));