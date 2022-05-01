const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
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
  const productCollection = client.db("deshboardUser").collection("products");

  //POST Method
  app.post('/products', async(req, res) => {
    const product = req.body;
    if (!product.name || !product.price) {
      return res.send({success:false, error: "Please Provide all Info Corectly"});
    }
    await productCollection.insertOne(product);
    res.send({success: true, message: `Successfully Product added ${product.name}`})
  })
//GET Method
app.get("/products", async(req, res) => {
  const items = parseInt(req.query.item);
  const pageNumber = parseInt(req.query.page);
  const cursor = productCollection.find({});
  const products = await cursor.skip(items*pageNumber).limit(items).toArray();
  const count = await productCollection.estimatedDocumentCount();
  if (!products?.length) {
    return res.send({success: false, error: "No Products Found"})
  }
  res.send({success: true, data: products, count})
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