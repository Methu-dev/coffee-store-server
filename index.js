const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

// coffeeMaster
// pQMutXNCSYaoLSK7


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dkacxyt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


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

    const coffeeCollection = client.db('coffeeDB').collection('coffee');
    const userCollection = client.db('coffeeDB').collection('users');

        app.get('/coffee', async(req, res)=>{
         const cursor = coffeeCollection.find();
         const result = await cursor.toArray();
         res.send(result)
        }) 
        
        app.get('/coffee/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await coffeeCollection.findOne(query)
            res.send(result)
        })

       app.post('/coffee', async(req, res)=>{
        const newcoffee = req.body;
        console.log(newcoffee);
        const result = await coffeeCollection.insertOne(newcoffee);
        res.send(result)
        
       })

       app.put('/coffee/:id', async (req, res)=>{
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = { upsert: true };
        const UpdateCoffee = req.body;
        const coffee = {
          $set:{
            name:UpdateCoffee.name,
             chef:UpdateCoffee.chef,
             supplier:UpdateCoffee.supplier,
             test:UpdateCoffee.test,
             category:UpdateCoffee.category,
             details:UpdateCoffee.details,
             photo:UpdateCoffee.photo
          }
        }
        const result = await coffeeCollection.updateOne(filter, coffee, options)
        res.send(result)
       })

       app.delete('/coffee/:id', async(req, res)=>{
        const id = req.params.id;
        const query ={ _id: new ObjectId(id)};
        const result = await coffeeCollection.deleteOne(query)
        res.send(result)
       })

       //user related

       app.get('/users', async(req, res)=>{
        const cursor = userCollection.find();
        const result = await cursor.toArray()
        res.send(result)
       })

       app.post('/users', async(req, res)=>{
        const users = req.body;
        const result = await userCollection.insertOne(users);
        res.send(result)
       })


       app.patch('/users', async (req, res)=>{
        const user = req.body;
        const filter = {email: user.email}
        const updateDoc = {
          $set:{
            lastLoggedTime: user.lastLoggedTime
          }
        }
        const result = await userCollection.updateOne(filter, updateDoc)
        res.send(result)
       })

       app.delete('/users/:id', async(req, res)=>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)}
        const result = await userCollection.deleteOne(query)
        res.send(result)
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


app.get('/', (req, res)=>{
    res.send('Coffee Making Running Server');
})

app.listen(port, ()=>{
    console.log(`coffe server running on port: ${port}`)
})