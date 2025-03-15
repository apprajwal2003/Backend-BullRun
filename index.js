const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Configure dotenv to load environment variables
dotenv.config();

const app = express();

// Define the MongoDB connection URI
const uri = process.env.MONGO_URL;

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(8080, () => {
  console.log("app started");
  mongoose
    .connect(uri)
    .then(() => {
      console.log("DB connected!");
    })
    .catch((error) => {
      console.error("DB connection error:", error);
    });
});
