const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { campgroundSchema } = require("./schemas.js");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
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

const validateCampground = (req, res, next) => {
  // 유효성검사를 할 함수를 미들웨어로 만든다.

  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    //result에 error가 존재하면 에러를 throw한다
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 404);
  } else {
    // 그렇지 않으면 이 함수의 뒤에 올 함수를 실행시킴
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});
// campgrounds/:id 아래에 두면 new를 id로 인식하기 때문에 위에둬야 함.

app.post(
  "/campgrounds",
  validateCampground, // 앞서 만든 미들웨어 함수
  catchAsync(async (req, res, next) => {
    // 몽구스에 throw된 에러가 발생하면 catchAsync가 이를 catch하여 next에 전달함
    // if (!req.body.campground) throw new ExpressError("유효하지 않은 데이터", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);
// 클릭한 해당 링크의 id를 받아옴

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground, // 이 부분 중괄호로 감싸야 작동함
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

// try를 사용하여 request를 보낼때 가장 쉬운 방법은 끝 부분에 app...을 다는 방법이다
// 여기서는 error 404를 만들 것이기 때문에 app.all을 사용한다 '*'는 모든path를 의미한다
// /campgrounds/없는 path는 따로 지정해 줘야 함.
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
