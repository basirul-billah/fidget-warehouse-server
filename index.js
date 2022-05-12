const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express.json());

// mongodb driver code 
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w0mx2.mongodb.net/fidgetWarehouseDB?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const productsCollection = client.db("fidgetWarehouse").collection("products");

        // to load all products 
        app.get('/products', async (req, res) => {
            const query = {};
            const cursor = productsCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })

        // to load single product 
        app.get('/itemdetails/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const product = await productsCollection.findOne(query);
            res.send(product);
        })

        // to add product
        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.send(result);
        })

        // to delete a product
        app.delete('/itemdetails/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productsCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally { }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('hello world 2');
})

app.listen(port, () => {
    console.log('listening to port', port);
})