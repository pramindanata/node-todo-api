const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017', {
    useNewUrlParser: true
}, (err, client) => {
    if (err) {
        return console.error('Unable to connect MongoDB service', err);
    }

    console.log('Connected to MongoDB server');

    const db = client.db('Todo');

    // db.collection('Todo')
    //     .find({
    //         _id: new ObjectID('5b5864890dc6c0b391752f7e')
    //     })
    //     .toArray()
    //     .then(docs => {
    //         console.log('Todos');
    //         console.log(JSON.stringify(docs, undefined, 2));
    //     }, err => {
    //         console.log('Unable to fetch Todo', err);
    //     });

    // db.collection('Todo')
    //     .find()
    //     .count()
    //     .then(count => {
    //         console.log('Todos count: ', count);
    //     }, err => {
    //         console.log('Unable to fetch Todo', err);
    //     })

    db.collection('Users')
        .find({
            name: {
                $nin: ['Eksa Pramindanata']
            }
        })
        .toArray()
        .then(docs => {
            console.log('Users');
            console.log(JSON.stringify(docs, undefined, 2));
        }, err => {
            console.log('Unable to fetch users', err);
        });

    // client.close();
});