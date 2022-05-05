const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config();
const cors = require("cors");
const port = process.env.PORT || 5000;
//middleware
app.use(cors());
app.use(express.json());
//start

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ovwjs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const run = async () =>{
 try{
await client.connect();
  const logicaCollection = client.db("logicaProduct").collection("products");

  // POST Method for new product add
  app.post('/products', async(req, res) => {
    const product = req.body;
    if (!product.name || !product.price || !product.images || !product.stock) {
      return res.send({success:false, error: "Please Provide all Info"});
    }
    await logicaCollection.insertOne(product);
    res.send({success: true, message: `Successfully Product added ${product.name}`})
  });
  
//GET Method for six product show of Home page
app.get("/products", async(req, res) => {
  const cursor = logicaCollection.find({});
  const products = await cursor.limit(6).toArray();
  if (!products?.length) {
    return res.send({success: false, error: "No Products Found"})
  }
  res.send({success: true, data:products})
})
//GET Method For find single product
app.get('/products/:id', async(req, res) => {
  const id = req.params.id;
  const query = {_id: ObjectId(id)};
  const result = await logicaCollection.findOne(query);
  res.send(result);
})
//GET method for find stock
app.get("/allproducts", async(req, res) => {
  const cursor = logicaCollection.find({});
  const products = await cursor.toArray();
  if (!products?.length) {
    return res.send({success: false, error: "No Products Found"})
  }
  res.send({success: true, data:products})
})


 }finally{

 }
}
run().catch(console.dir);


//END
app.get('/',(req,res) => {
    res.send('server ruuing.....');
});
app.listen(port, () => {
    console.log('server running on port: ', port);
})