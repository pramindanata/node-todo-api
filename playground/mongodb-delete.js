const {MongoClient, ObjectID} = require('mongodb')

MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true
}, (err, client) => {
    if (err) {
        return console.error('Unable to connect MongoDB service', err);
    }

    console.log('Connected to MongoDB server');

    const db = client.db('Todo');

    // db.collection('Todo').deleteMany({ "text" : "Bathing" }).then(result => console.log(result));

    // db.collection('Todo').deleteOne({ "text": "Eat" }).then(result => console.log(result));

    // db.collection('Todo').findOneAndDelete({ "text": "Something To Do" }).then(result => console.log(result));

    // db.collection('Todo').deleteMany({
    //     completed: false
    // }).then((result) => console.log(result));

    db.collection('Todo').findOneAndDelete({
        _id: new ObjectID('5b5c36a35fff632a7efafc9f')
    }).then(result => console.log(result));

    // client.close();
});
