const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = process.env.PORT || 5000;
//middleware
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
//verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send({ message: "unathurized access" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SCRETE, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "Forbidden Access" });
    }
    req.decoded = decoded;
    next();
  });
};

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ovwjs.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const run = async () => {
  try {
    await client.connect();

    const logicaCollection = client.db("logicaProduct").collection("products");
    // JWT AUTH for login
    app.post("/login", (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SCRETE, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
    });

    // POST Method for new product add
    app.post("/allproducts", async (req, res) => {
      const product = req.body;
      if (
        !product.name ||
        !product.price ||
        !product.images ||
        !product.stock
      ) {
        return res.send({ success: false, error: "Please Provide all Info" });
      }
      await logicaCollection.insertOne(product);
      res.send({
        success: true,
        message: `Successfully Product added ${product.name}`,
      });
    });

    //GET Method for six product show of Home page
    app.get("/products", async (req, res) => {
      const cursor = logicaCollection.find({});
      const products = await cursor.limit(6).toArray();
      if (!products?.length) {
        return res.send({ success: false, error: "No Products Found" });
      }
      res.send({ success: true, data: products });
    });

    //GET Method For find single product
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await logicaCollection.findOne(query);
      res.send(result);
    });

    //GET method for getting all product
    app.get("/allproducts", async (req, res) => {
      const cursor = logicaCollection.find({});
      const products = await cursor.toArray();
      if (!products?.length) {
        return res.send({ success: false, error: "No Products Found" });
      }
      res.send({ success: true, data: products });
    });

    //GET method for delivery
    app.get("/allproducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await logicaCollection.findOne(query);
      res.send(result);
    });

    //Update method for stock update
    app.put("/allproducts/:id", async (req, res) => {
      const id = req.params.id;
      const updateStock = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          stock: updateStock.deliver,
        },
      };
      const result = await logicaCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    //FIND method for my product by Email
    app.get("/myproducts", verifyToken, async (req, res) => {
      const decodedEmail = req.decoded.email;
      const email = req.query.email;
      if (decodedEmail === email) {
        const query = { email: email };
        const cursor = logicaCollection.find(query);
        const orders = await cursor.toArray();
        res.send(orders);
      } else {
        res.status(403).send({ message: "Forbidden Access" });
      }
    });

    //DELETE method , single item delete from manage item page
    app.delete("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await logicaCollection.deleteOne(query);
      res.send({ message: "One Item Deleted!" });
    });
  } finally {
  }
};
run().catch(console.dir);

//END
app.get("/", (req, res) => {
  res.send("server ruuing.....");
});
app.listen(port, () => {
  console.log("server running on port: ", port);
});
