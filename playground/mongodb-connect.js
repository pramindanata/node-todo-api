// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true
}, (err, client) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    } 

    console.log('Connected to MongoDB server');

    const db = client.db('Todo');

    // db.collection('Todo')
    //     .insertOne({
    //         text: "Something to do",
    //         completed: false
    //     }, (err, result) => {
    //         if (err) {
    //             return console.log('Unable to add todo', err);
    //         }

    //         console.log(JSON.stringify(result.ops, undefined, 2));
    //     });

    // db.collection('Users')
    //     .insertOne({
    //         name: "Eksa Pramindanata",
    //         age: "19",
    //         location: "Indonesia"
    //     }, (err, result) => {
    //         if (err) {
    //             return console.log('Unable to add user', err);
    //         }

    //         console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
    //     })

    client.close();
});