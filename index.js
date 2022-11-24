const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config();

const app = express();

// middleware
app.use(cors());
app.use(express.json());



// MongoDB database connection
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Password}@cluster0.9h6j3eg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});





//check that server is running
app.get('/', async (req, res) => {res.send('TrieX server is running');})
app.listen(port, () => console.log(`TireX server is running on ${port}`));
