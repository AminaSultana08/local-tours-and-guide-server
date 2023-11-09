const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000

//middleware
app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wua58o9.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
//tourGuide

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //  await client.connect();

    const serviceCollection = client.db('tourGuide').collection('services')
    const bookingCollection = client.db('tourGuide').collection('bookings')


    //read services
    app.get('/services', async(req,res)=>{
      try{
        console.log(req.query.email);
        let query = {}
        if(req.query?.email){
          query = {email : req.query.email}

        }
        const cursor = serviceCollection.find()
        const result = await cursor.toArray()
        res.send(result)

      }
      catch(error){
        console.log(error);
      }
    })

    //singleService
    app.get('/services/:id', async(req,res)=>{
      try{
        const id = req.params.id
        const query = {_id : new ObjectId(id)}
        const options = {
         
          // Include only the `title` and `imdb` fields in the returned document
          projection: { address: 1,description:1,email:1,photo:1,price:1 , providerName:1,serviceName:1 },
        };
    
        const result = await serviceCollection.findOne(query,options)
        res.send(result)
      }
      catch (error) {
        console.log(error);
      }
    })


   //add services
   
   app.post('/services',async(req,res)=>{
    try{
      const newService = req.body
      const result = await serviceCollection.insertOne(newService)
      res.send(result)

    }
    catch (error) {
      console.log(error);

    }
   })

   //bookings
   app.get('/bookings',async(req,res)=>{
    try{
      console.log(req.query.email);
      let query ={};
      if(req.query?.email){
        query = {email : req.query.email}
      }

      const result = await bookingCollection.find(query).toArray()
      res.send(result)
    }
    catch(error){
      console.log(error);
    }
   })


   app.post('/bookings', async(req,res)=>{
    try{
      const booking = req.body
      console.log(booking);
      const result = await bookingCollection.insertOne(booking)
      res.send(result)
    }
    catch(error) {
      console.log(error);
    }
   })

    // app.get('/services', async(req,res)=>{
    //     const cursor = serviceCollection.find();
    //     const result= await cursor.toArray()
    //     res.send(result)
    // })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/',async(req,res)=>{
    res.send('local tour guide is running')
})

app.listen(port,()=>{
    console.log(`local tours and guide is running on PORT ${port}`);
})