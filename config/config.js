const mongoose = require("mongoose");
require("dotenv").config();
const { MONGO_URI, NODE_ENV, MONGO_URI_TEST } = process.env;

const dbConnection = async () => {
  try {
    if (NODE_ENV == "test") {
      return await mongoose.connect(MONGO_URI_TEST);
    }
    await mongoose.connect(MONGO_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error(error);
    throw new Error("Error when starting the database");
  }
};

module.exports = {
  dbConnection,
};
