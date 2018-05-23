const express = require('express');
const models = require('./models');
const expressGraphQL = require('express-graphql');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const schema = require('./schema/schema');
const env = require('node-env-file');

// Create a .env file in this directory with the MONGO_URI in it
env(__dirname + '/.env');

console.log(process.env);

const app = express();

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  throw new Error('You must provide a Mongo URI');
}

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, {useMongoClient: true});
mongoose.connection
    .once('open', () => console.log('Connected to Mongo instance.'))
    .on('error', error => console.log('Error connecting to Mongo:', error));

app.use(bodyParser.json());
app.use('/graphql', expressGraphQL({
  schema,
  graphiql: true
}));

const webpackMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
app.use(webpackMiddleware(webpack(webpackConfig)));

module.exports = app;
