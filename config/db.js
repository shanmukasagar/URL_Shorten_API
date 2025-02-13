const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);

const connectDB = async () => { // Connect to mongodb
  try {
    await client.connect();
    console.log('MongoDB Connected');
  } 
  catch (err) {
    console.error('MongoDB Connection Failed', err);
    process.exit(1);
  }
};

const getDB = () => client.db('alter_ofc'); // Database Name

module.exports = { connectDB, getDB };
