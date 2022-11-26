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
        const bookingsCollection = client.db('TireX').collection('bookings');
        const usersCollection = client.db('TireX').collection('users');


        // usersCollection
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        });

        //all sellers----------------------------------------------------
        app.get('/allsellers', async (req, res) => {
            const userType = "Seller";
            const query = { userType: userType }
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        });
        //all buyers----------------------------------------------------
        app.get('/allbuyers', async (req, res) => {
            const userType = "Buyer";
            const query = { userType: userType }
            const result = await usersCollection.find(query).toArray();
            res.send(result);
        });

        //admin
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.userType === 'Admin' });
        });
        // buyer
        app.get('/users/buyer/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isBuyer: user?.userType === 'Buyer' });
        });

        // delete buyer
        app.delete('/buyers/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        });

        // delete seller
        app.delete('/sellers/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const result = await usersCollection.deleteOne(filter);
            res.send(result);
        });


        //bookings collection
        app.post('/bookings', async (req, res) => {
            const booking = req.body;
            // user cannot book multiple item on same date
            const query = {
                bookingDate: booking.bookingDate,
                userEmail: booking.userEmail
            }
            const alreadyBooking = await bookingsCollection.find(query).toArray();
            if (alreadyBooking.length) {
                const message = `You already booked on ${booking.bookingDate}`
                return res.send({ acknowledged: false, message })
            }

            const result = await bookingsCollection.insertOne(booking);
            res.send(result);
        });

        // get specific booking
        app.get('/booking/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const booking = await bookingsCollection.findOne(query);
            res.send(booking);

        });

        app.get('/bookings', async (req, res) => {
            const email = req.query.email;
            const query = { userEmail: email };
            const bookings = await bookingsCollection.find(query).toArray();
            res.send(bookings);
        });

        app.get('/allbookings', async (req, res) => {
            const query = {};
            const result = await bookingsCollection.find(query).toArray();
            res.send(result)
        });

        // products collection loaded
        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoryCollection.find(query).toArray();
            res.send(categories);
        });

        // individual category data loaded
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
