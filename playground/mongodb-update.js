const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true,
}, (err, client) => {
    if (err) return console.error('Unable to connect MongoDB service', err);

    console.log('Connected to MongoDB server');

    const db = client.db('Todo');

    db.collection('Users').findOneAndUpdate({
        name: "Snek"
    }, {
        $inc: {
            age: 2,
        }
    })
    .then(result => console.log(result));
});