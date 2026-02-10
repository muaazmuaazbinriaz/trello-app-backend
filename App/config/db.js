const mongoose = require("mongoose");
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  if (mongoose.connection.readyState === 2) {
    await new Promise((resolve) => {
      mongoose.connection.once("connected", resolve);
    });
    isConnected = true;
    return;
  }
  try {
    await mongoose.connect(process.env.DBURL, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
    });
    isConnected = true;
    console.log("MongoDB connected...");
  } catch (err) {
    isConnected = false;
    console.log("MongoDB connection error:", err);
    throw err;
  }
};

module.exports = connectDB;
