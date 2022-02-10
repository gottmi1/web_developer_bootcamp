const express = require("express");
const app = express();
const path = require("path");
const redditData = require("./data.json");

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "EJS");
app.set("views", path.join(__dirname, "/views"));
// pwe가 기본과 다를 때 실행가능

app.get("/", (req, res) => {
  res.render("home.ejs");
  // home.ejs가 있는 폴더명이 디폴트인 views이기 때문에 경로 안 적어줘도 됨.
});

app.get("/r/:subreddit", (req, res) => {
  const { subreddit } = req.params;
  const data = redditData[subreddit];
  if (data) {
    res.render("subreddit", { ...data });
  } else {
    res.render("notfound", { subreddit });
  }
});

app.get("/cats", (req, res) => {
  const cats = ["Blue", "Rocket", "Stephanie", "Windston"];
  res.render("cats", { cats });
});

app.get("/rand", (req, res) => {
  const num = Math.floor(Math.random() * 10) + 1;
  res.render("random.ejs", { num });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
