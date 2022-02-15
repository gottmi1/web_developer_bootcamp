const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/test", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("coc");
  })
  .catch((err) => {
    console.log("tgmnjdfgjdf");
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/dog", (req, res) => {
  res.send("wood!asd");
});

app.listen(3000, () => {
  console.log("App is port 3000");
});
