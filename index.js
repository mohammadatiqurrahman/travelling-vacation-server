const express = require('express')
const { MongoClient } = require('mongodb');
const cors = require('cors')
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
// MIDLEWARE
app.use(cors())
app.use(express.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ql7ij.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try {
        await client.connect();
        // console.log('connected!');
        const database = client.db("travelgoru");
        const collection = database.collection('places');
        const userCollection = database.collection('user_info');

        // GET API FROM DATABASE
        app.get('/service', async(req,res)=>{
            const cursor = collection.find({});
            const service = await cursor.toArray();
            res.send(service);
            // res.send(users)
          })
        // GET SINGLE API FROM DATAASE
        app.get('/service/:id', async(req,res)=>{
          const id = req.params.id;
          const query = {_id:ObjectId(id)}
          const result= await collection.findOne(query)
          // console.log('get id: ',id);
          res.send(result)
        })
        // GET USER API FROM DATABASE
        app.get('/user_info', async(req,res)=>{
          const cursor = userCollection.find({});
          const result = await cursor.toArray();
          res.send(result);
          // res.send(users)
        })
        // POST API
        app.post('/places', async(req,res)=>{
            const place = req.body;
            const result = await collection.insertOne(place)
            // console.log('hittine the posst',req.body);
            // console.log('inserte user', result);
            res.json(result);
          })

        // POST USER API
        app.post('/users', async(req,res)=>{
            const user = req.body;
            const result = await userCollection.insertOne(user)
            res.json(result);
          })

          // DELETE USER API

          app.delete('/users/:id',async(req,res)=>{
            const id=req.params.id;
            const query = {_id:ObjectId(id)}
            const result = await userCollection.deleteOne(query)
            // console.log(result);
            res.json(result);
          })

    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('server is running! yehh!!!!');
})
app.get('/hello',(req,res)=>{
    res.send('hello heroku?');
})
app.listen(port,()=>{
    console.log('Server Running on Port', port);
})