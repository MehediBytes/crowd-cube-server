require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lzi65.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


const run = async () => {
    try {
        // await client.connect();

        const database = client.db('campaignDB');

        usersCollection = database.collection('users');
        campaignsCollection = database.collection('campaigns');
        donationsCollection = database.collection('donations');


        // Create New Campaign
        app.post('/campaigns', async (req, res) => {
            const campaign = req.body;
            const result = await campaignsCollection.insertOne(campaign);
            res.send(result);
        });

        // Get All Campaigns
        app.get('/campaigns', async (req, res) => {
            const campaigns = await campaignsCollection.find().toArray();
            res.send(campaigns);
        });

        // Get Campaign Details by ID
        app.get('/campaigns/:id', async (req, res) => {
            const id = req.params.id;
            const campaign = await campaignsCollection.findOne({ _id: new ObjectId(id) });
            res.send(campaign);
        });

        // Delete a Campaign from database
        app.delete('/campaigns/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await campaignsCollection.deleteOne(query);
            res.send(result);
        })

        // Update a campaign on database
        app.put('/campaigns/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: req.body
            }

            const result = await campaignsCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })


        // Save User to Database (Register)
        app.get('/users', async (req, res) => {
            const cursor = usersCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            const result = await usersCollection.insertOne(newUser);
            res.send(result);
        });


        // Donation-collection
        app.post('/donations', async (req, res) => {
            const donation = req.body;
            const result = await donationsCollection.insertOne(donation);
            res.send(result);
        });

        app.get('/donations', async (req, res) => {
            const donations = await donationsCollection.find().toArray();
            res.send(donations);

        });
    }

    finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
};

run().catch(console.dir);

// Home Route
app.get('/', (req, res) => {
    res.send('Crowd-cube API is running!');
});

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});