const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { MongoClient } = require('mongodb');

require('dotenv').config();

const url = process.env.DB_URL || 'mongodb+srv://jacobjin:password1234@cluster0.e2rok.mongodb.net/inventory?retryWrites=true';
const port = process.env.API_SERVER_PORT || 3000;

let aboutMessage = 'Inventory Tracker API v1.0';

let db;

function setAboutMessage(_, { message }) {
  aboutMessage = message;
  return aboutMessage;
}

async function getNextSequence(name) {
  const result = await db.collection('counters').findOneAndUpdate(
    { _id: name },
    { $inc: { current: 1 } },
    { returnOriginal: false },
  );
  return result.value.current;
}

async function productAdd(_, { product }) {
  const newProduct = { ...product };
  newProduct.id = await getNextSequence('products');

  const result = await db.collection('products').insertOne(newProduct);

  const savedProduct = await db.collection('products')
    .findOne({ _id: result.insertedId });
  return savedProduct;
}

async function productGet(_, { id }) {
  const product = await db.collection('products').findOne({ id });
  return product;
}

async function productUpdate(_, { id, modify }) {
  await db.collection('products').updateOne({ id }, { $set: modify });
  const savedProduct = await db.collection('products').findOne({ id });
  return savedProduct;
}

async function productDelete(_, { id }) {
  const product = await db.collection('products').findOne({ id });
  if (!product) return false;
  await db.collection('products').removeOne({ id });
  return true;
}

async function productList() {
  const products = await db.collection('products').find({}).toArray();
  return products;
}

async function productCount() {
  const count = await db.collection('products').count();
  return count;
}

const resolvers = {
  Query: {
    about: () => aboutMessage,
    productList,
    productGet,
    productCount,
  },
  Mutation: {
    setAboutMessage,
    productAdd,
    productUpdate,
    productDelete,
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync('schema.graphql', 'utf-8'),
  resolvers,
});

const app = express();

server.applyMiddleware({ app, path: '/graphql' });

async function connectToDb() {
  const client = new MongoClient(url, { useNewUrlParser: true });
  await client.connect();
  console.log('Connected to MongoDB at', url);
  db = client.db();
}

(async function start() {
  try {
    await connectToDb();
    app.listen(port, () => {
      console.log(`App started on port ${port}`);
    });
  } catch (err) {
    console.log('ERROR:', err);
  }
}());
