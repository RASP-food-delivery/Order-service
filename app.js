const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require('cors');
const orderRoutes = require("./routes/orderRoutes")
// require database connection
const dbConnect = require("./db/dbConnect");
const auth = require("./auth");

// execute database connection using imported function
dbConnect();

// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// body parser configuration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
// app.get("/", (request, response, next) => {
//   response.json({ message: "Hey! This is your server response!" });
//   next();
// });

app.use("/api/order", orderRoutes)

// free endpoint
app.get("/free-endpoint", (request, response) => {
  response.json({ message: "You are free to access me anytime" });
});

// authentication endpoint
app.get("/auth-endpoint", auth, (request, response) => {
  response.send({ message: "You are authorized to access me" });
});

module.exports = app;
