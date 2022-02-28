const fs = require('fs');
const express = require('express');
const {ApolloServer} = require('apollo-server-express');

let aboutMessage = 'Inventory Tracker API v1.0';

const productDB = [
  {
    id: 1, category: 'Shirts', name: 'white t-shirt', price: 19.99, image: ''
  },
  {
    id: 2, category: 'Jeans', name: 'blue jeans', price: 29.99, image: ''
  }
]

const resolvers = {
  Query: {
    about: () => aboutMessage,
    productList
  },
  Mutation: {
    setAboutMessage,
    productAdd
  }
};

function setAboutMessage(_, {message}) {
  return aboutMessage = message;
}

function productAdd(_, {product}) {
  product.id = productDB.length + 1;
  productDB.push(product);
  return product;
}

function productList() {
  return productDB;
}

const server = new ApolloServer({
  typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
  resolvers
});

const app = express();

app.use(express.static('public'));

server.applyMiddleware({app, path: '/graphql'});

app.listen(3000, function() {
  console.log('App started on port 3000');
});
