const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;
 

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.USER_PASS}@cluster0.01a84k1.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const BrandCollection = client.db("BrandShop").collection('BrandItem');
    const CartCollection = client.db("BrandShop").collection('CartItem');

    app.post('/brands', async (req, res) => {
      const brand = req.body;
      const result = await BrandCollection.insertOne(brand);
      res.send(result);

    })
    app.get('/brands', async (req, res) => {
      const cursor = BrandCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })
    app.post('/myCart', async (req, res) => {
      const cart = req.body;
      const result = await CartCollection.insertOne(cart);
      res.send(result);
    })


    app.get('/myCart', async (req, res) => {
      const cursor = CartCollection.find();
      const result = await cursor.toArray();
      res.send(result);

    })


    app.put("/myCart/:id", async (req, res) => {
      const id = req.params.id;
      const newCard = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCard = {
        $set: {
          name: newCard.name,
          brandName: newCard.brandName,
          type: newCard.type,
          rating: newCard.rating,
          price: newCard.price,
          photo: newCard.photo,
        },
      };
      const result = await CartCollection.updateOne(
        filter,
        updateCard,
        options
      );
      res.send(result);
    });

    app.delete('/myCart/:id', async (req, res) => {
      const id = req.params.id
      console.log(id);
      const query = { _id: id }
      const result = await CartCollection.deleteOne(query)
      res.send(result)
      console.log(result)
    })

    app.get('/cardInfo/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await BrandCollection.findOne(query)
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
  res.send('My server is running')
})


app.listen(port, () => {
  console.log(`My server: ${port}`);
})