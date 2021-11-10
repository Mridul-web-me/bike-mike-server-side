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
        const database = client.db('ghuraghuri');
        const packagesCollection = database.collection('packages');
        const emailCollection = database.collection('serviceEmail');



        // GET API
        app.get('/packages', async (req, res) => {
            const cursor = packagesCollection.find({});
            const packages = await cursor.toArray();
            res.send(packages);
        })

        // GET API
        app.get('/serviceEmail', async (req, res) => {
            const cursor = emailCollection.find({});
            const serviceEmail = await cursor.toArray();
            res.send(serviceEmail);
        })

        // GET SINGLE Package

        app.get('/packages/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting packages');
            const query = { _id: ObjectId(id) };
            const package = await packagesCollection.findOne(query);
            res.json(package);

        })

        // POST API
        app.post('/packages', async (req, res) => {
            const package = req.body;
            console.log('hit the api', package);
            const result = await packagesCollection.insertOne(package);
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

        console.log('Database Connected');
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