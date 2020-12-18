import mongoose from "mongoose";
import bluebird from "bluebird";

/**
 * Connect to MongoDB
 */
let connectDB = () => {
  mongoose.Promise = bluebird;
  let URI = `mongodb://alochat:alochat@cluster0-shard-00-00.ncleb.mongodb.net:27017,cluster0-shard-00-01.ncleb.mongodb.net:27017,cluster0-shard-00-02.ncleb.mongodb.net:27017/alochat1?ssl=true&replicaSet=atlas-xvs9mq-shard-0&authSource=admin&retryWrites=true&w=majority`;
  return mongoose.connect(URI, {useMongoClient: true});
};

module.exports = connectDB;
