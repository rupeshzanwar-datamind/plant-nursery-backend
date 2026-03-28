const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
mongoose.connect("mongodb+srv://admin:admin123@cluster0.eackwdo.mongodb.net/nursery")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

app.use("/api", require("./auth"));

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});