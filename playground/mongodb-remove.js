const { ObjectID } = require('mongodb');
const { mongoose } = require('./../server/db/mongoose');
const { Todo } = require('./../server/models/todo');

// Todo.remove({ _id: new ObjectID('5b78108a3e3817221020b5de')  })
//     .then(result => console.log(result));

Todo.findByIdAndRemove('5b7810923e3817221020b5df')
    .then(doc => console.log(doc));