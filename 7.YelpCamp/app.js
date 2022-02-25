const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Campground = require("./models/Campground");
const Review = require("./models/review");
const { urlencoded, application } = require("express");

const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");

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
app.use(express.static(path.join(__dirname, "public"))); // 적용할 js파일들의 기본 경로를 정해주기위함.
const sessionConfig = {
  secret: "jinwon",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: +1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.del = req.flash("del");
  res.locals.update = req.flash("update");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campgrounds", campgrounds); // 경로가 이렇게 간단할 땐 Router({mergeParams : true})가 필요없지만
app.use("/campgrounds/:id/reviews", reviews); // 기본 경로에 id가 포함된 이런 상황에선 필요한 듯 함

app.get("/", (req, res) => {
  res.render("home");
});

// try를 사용하여 request를 보낼때 가장 쉬운 방법은 끝 부분에 app...을 다는 방법이다
// 여기서는 error 404를 만들 것이기 때문에 app.all을 사용한다 '*'는 모든path를 의미한다
// /campgrounds/(존재하지 않는path)는 따로 지정해 줘야 함.
app.all("*", (req, res, next) => {
  next(new ExpressError("페이지를 찾을 수 없음", 404)); // 아래에 있는 에러핸들러로 보냄
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "에러입니다"; //err.message가 비었을 때 디폴트 값을 만들어주는것
  res.status(statusCode).render("error", { err });
  // new에서만 바로 연결되지 않고, 한번 app crashd가 일어난 후 다시 연결됐을 때 이걸 실행한다. 왜 이런지는 잘 모르겠음.
});

app.listen(3000, () => {
  console.log("port 3000에서 Serving 중 . . .");
});
