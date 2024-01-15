const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");

const dbConnection = async () => {
  try {
    const dbConn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Successfully connected to Mongodb, ${dbConn.connection.host}`);
  } catch (error) {
    throw new ApiError(500, "Error occured while connecting to Mongodb.", [
      error.message,
    ]);
  }
};

module.exports = dbConnection;
