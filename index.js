const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());



// MongoDB database connection
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.9h6j3eg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        // database collection
        const productsCollection = client.db('TireX').collection('products');
        const categoryCollection = client.db('TireX').collection('categories');

        // get products collection
        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoryCollection.find(query).toArray();
            res.send(categories);
        });

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { categoryId: id };
            const category = await productsCollection.find(query).toArray();
            res.send(category);
        });

    }
    finally {

    }

}
run().catch(console.log);





//check that server is running
app.get('/', async (req, res) => { res.send('TrieX server is running'); })
app.listen(port, () => console.log(`TireX server is running on ${port}`));
