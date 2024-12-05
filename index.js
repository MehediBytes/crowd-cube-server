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
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let usersCollection, campaignsCollection, donationsCollection;

const run = async () => {
    try {
        await client.connect();
        const database = client.db('campaignDB');
        usersCollection = database.collection('users');
        campaignsCollection = database.collection('campaigns');
        donationsCollection = database.collection('donations');

        console.log('Connected to MongoDB');
    }
    
    finally {
        // Ensures that the client will close when you finish/error
        //   await client.close();
    }
};

run().catch(console.dir);

// Routes

// Home Route
app.get('/', (req, res) => {
    res.send('Crowd-cube API is running!');
});

// Donation-collection
app.post('/donations', async (req, res) => {
    const donation = req.body;
    try {
        const result = await donationsCollection.insertOne(donation);
        res.json({ message: 'Donation saved successfully!', result });
    } catch (error) {
        res.json({ error: 'Failed to save donation data.' });
    }
});

// Get All Donations
app.get('/donations', async (req, res) => {
    const donations = await donationsCollection.find().toArray();
    res.send(donations);

});

// Save User to Database (Register)
app.get('/users', async (req, res) => {
    const cursor = usersCollection.find();
    const result = await cursor.toArray();
    res.send(result);
})

app.post('/users', async (req, res) => {
    const user = req.body;
    try {
        const existingUser = await usersCollection.findOne({ email: user.email });
        if (existingUser) {
            return res.json({ message: 'User already exists' });
        }
        const result = await usersCollection.insertOne(user);
        res.json(result);
    } catch (error) {
        res.json({ message: 'Failed to save user', error: error.message });
    }
});

// // Get User Info by Email
// app.get('/users/:email', async (req, res) => {
//     const email = req.params.email;
//     try {
//         const user = await usersCollection.findOne({ email });
//         if (!user) {
//             return res.json({ message: 'User not found' });
//         }
//         res.json(user);
//     } catch (error) {
//         res.json({ message: 'Failed to fetch user', error: error.message });
//     }
// });

// Create New Campaign
app.post('/campaigns', async (req, res) => {
    const campaign = req.body;
    try {
        const result = await campaignsCollection.insertOne(campaign);
        res.json(result);
    } catch (error) {
        res.json({ message: 'Failed to create campaign', error: error.message });
    }
});

// Get All Campaigns
app.get('/campaigns', async (req, res) => {
    try {
        const campaigns = await campaignsCollection.find().toArray();
        res.json(campaigns);
    } catch (error) {
        res.json({ message: 'Failed to fetch campaigns', error: error.message });
    }
});

// Get Campaign Details by ID
app.get('/campaigns/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const campaign = await campaignsCollection.findOne({ _id: new ObjectId(id) });
        if (!campaign) {
            return res.json({ message: 'Campaign not found' });
        }
        res.json(campaign);
    } catch (error) {
        res.json({ message: 'Failed to fetch campaign', error: error.message });
    }
});

// // Update Campaign
// app.put('/campaigns/:id', async (req, res) => {
//     const id = req.params.id;
//     const updatedData = req.body;
//     try {
//         const result = await campaignsCollection.updateOne(
//             { _id: new ObjectId(id) },
//             { $set: updatedData }
//         );
//         if (result.matchedCount === 0) {
//             return res.json({ message: 'Campaign not found' });
//         }
//         res.json(result);
//     } catch (error) {
//         res.json({ message: 'Failed to update campaign', error: error.message });
//     }
// });

// // Delete Campaign
// app.delete('/campaigns/:id', async (req, res) => {
//     const id = req.params.id;
//     try {
//         const result = await campaignsCollection.deleteOne({ _id: new ObjectId(id) });
//         if (result.deletedCount === 0) {
//             return res.json({ message: 'Campaign not found' });
//         }
//         res.json(result);
//     } catch (error) {
//         res.json({ message: 'Failed to delete campaign', error: error.message });
//     }
// });

// Start Server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});