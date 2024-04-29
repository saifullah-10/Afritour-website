const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());
// DB Code

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.kpsyb7k.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const database = client.db("tourism");
const places = database.collection("places");
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    app.post("/places", async (req, res) => {
      const newData = req.body;
      const result = await places.insertOne(newData);
      res.send(result);
    });

    app.get("/places/id/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };

      try {
        const singleData = await places.findOne(query);
        res.send(singleData);
      } catch {
        res.send("server error");
      }
    });
    app.get("/places/:amount", async (req, res) => {
      const dataAmount = req.params.amount;
      try {
        const cursor = await places.find().toArray();
        const data = cursor.slice(0, dataAmount);
        res.send(data);
      } catch (err) {
        console.error("Error fetching data:", err);
        res.send("Internal Server Error");
      }
    });
    app.get("/places", async (req, res) => {
      try {
        const cursor = await places.find().toArray();
        res.send(cursor);
      } catch {
        res.send("Server Error");
      }
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// DB Code

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(PORT, () => {
  console.log("server running on", PORT);
});
