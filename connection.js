const mongoose = require("mongoose");

//Connection to db
async function connectMongoDb(url) {
  return mongoose.connect(url);
}

module.exports = {
  connectMongoDb,
};
