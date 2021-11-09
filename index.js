const express = require('express')
const { MongoClient } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q92bv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("connected")
        const database = client.db("Volunteer_Network");
        const serviceCollection = database.collection("Services");
        const adminCollection = database.collection("Admin");

        //POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });
        //POST API for admin
        app.post('/admin', async (req, res) => {
            const admin = req.body;
            const result = await adminCollection.insertOne(admin);
            console.log(result);
            res.json(result);
        });
        // GET API
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({})
            const service = await cursor.toArray()
            res.send(service);
        })
        // GET API for admin
        app.get('/admin', async (req, res) => {
            const cursor = adminCollection.find({})
            const admin = await cursor.toArray()
            res.send(admin);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})