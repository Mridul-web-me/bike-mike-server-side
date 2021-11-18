const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;


const port = process.env.PORT || 8080;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kki34.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('bikesmikes');
        const bikesCollection = database.collection('bikes');
        const emailCollection = database.collection('serviceEmail');
        const usersCollection = database.collection('users');
        const reviewCollection = database.collection('review');
        const orderCollection = database.collection('placeOrder');

        // GET API
        app.get('/bikes', async (req, res) => {
            const cursor = bikesCollection.find({});
            const bikes = await cursor.toArray();
            res.send(bikes);
        })


        // GET API
        app.get('/serviceEmail', async (req, res) => {
            const cursor = emailCollection.find({});
            const serviceEmail = await cursor.toArray();
            res.send(serviceEmail);
        })
        // GET API
        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const review = await cursor.toArray();
            res.send(review);
        })

        // GET SINGLE Bike

        app.get('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting bikes');
            const query = { _id: ObjectId(id) };
            const bike = await bikesCollection.findOne(query);
            res.json(bike);

        })

        // POST API
        app.post('/bikes', async (req, res) => {
            const bike = req.body;
            console.log('hit the api', bike);
            const result = await bikesCollection.insertOne(bike);
            console.log(result);
            res.json(result)
        })

        // POST API
        app.post('/serviceEmail', async (req, res) => {
            const email = req.body;
            console.log('hit the api', email);
            const result = await emailCollection.insertOne(email);
            console.log(result);
            res.json(result)
        })

        // POST API
        app.post('/review', async (req, res) => {
            const review = req.body;
            console.log('hit the api', review);
            const result = await reviewCollection.insertOne(review);
            console.log(result);
            res.json(result)
        })
        app.post('/placeOrder', async (req, res) => {
            const placeOrder = req.body;
            console.log('hit the api', placeOrder);
            const result = await orderCollection.insertOne(placeOrder);
            console.log(result);
            res.json(result)
        })

        console.log('Database Connected');
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            res.json({ admin: isAdmin });
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });


        // DELETE OPERATION
        app.delete('/bikes/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bikesCollection.deleteOne(query);
            res.json(result);
        })


        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);

        })
    }



    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('khatam tata bye bye')
})

app.listen(port, () => {
    console.log(`Example app listening at localhost:${port}`);
})


