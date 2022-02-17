const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Campground = require("./models/Campground");
const { urlencoded } = require("express");

main()
  .then(() => {
    console.log("localhost:27017 database conneted");
  })
  .catch((err) => {
    console.log("localhost:27017 NO CONNECT");
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://localhost:27017/Yelp-camp");
}

const app = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
// 기본 폴더 경로를 views/ 로 만들기 위한 작업

app.use(urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
// campgrounds/:id 아래에 두면 new를 id로 인식하기 때문에 위에둬야 함.

app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show", { campground });
});
// 클릭한 해당 링크의 id를 받아옴

app.get("/campgrounds/:id/edit", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground, // 이 부분 중괄호로 감싸야 작동함
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.listen(3000, () => {
  console.log("port 3000에서 Serving 중 . . .");
});
