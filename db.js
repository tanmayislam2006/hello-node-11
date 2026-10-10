const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://shopInventoryManager:4FjKRKGEO5dpfzS4@crudapp.rsibkyv.mongodb.net/?appName=crudApp";
let client;
let connectionPromise;

async function connectToMongoDB() {
  if (!uri) {
    throw new Error("MONGODB_URI is not set");
  }

  if (!client) {
    client = new MongoClient(uri);
  }

  if (!connectionPromise) {
    connectionPromise = client.connect().catch((error) => {
      connectionPromise = undefined;
      throw error;
    });
  }

  await connectionPromise;
  return client;
}

async function checkMongoDB() {
  const dbClient = await connectToMongoDB();
  await dbClient.db().command({ ping: 1 });
}

async function insertItem(item) {
  const dbClient = await connectToMongoDB();
  const database = dbClient.db(process.env.MONGODB_DATABASE || "hello_node");
  return database.collection("items").insertOne(item);
}

async function disconnectFromMongoDB() {
  if (client) {
    await client.close();
    client = undefined;
    connectionPromise = undefined;
  }
}

module.exports = {
  connectToMongoDB,
  checkMongoDB,
  insertItem,
  disconnectFromMongoDB,
};
