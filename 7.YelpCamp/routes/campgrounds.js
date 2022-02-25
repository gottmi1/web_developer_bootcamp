const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/Campground");
const { campgroundSchema } = require("../schemas.js");

// --------------------미들 웨어
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

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", (req, res) => {
  res.render("campgrounds/new");
});
// campgrounds/:id 아래에 두면 new를 id로 인식하기 때문에 위에둬야 함.

router.post(
  "/",
  validateCampground, // 앞서 만든 미들웨어 함수
  catchAsync(async (req, res, next) => {
    // 몽구스에 throw된 에러가 발생하면 catchAsync가 이를 catch하여 next에 전달함
    // if (!req.body.campground) throw new ExpressError("유효하지 않은 데이터", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash("success", "새로운 캠핑장이 생성되었습니다"); //플래시 생성
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("error", "캠핑장을 찾을 수 없습니다");
      res.redirect("/campgrounds");
      // 한 캠핑장을 북마크에 저장해놓고 삭제하거나 해서 주소가 사라졌을 경우, 에러를 띄우는 대신 campgrounds로 리다이렉트 해주며 error alert를 띄움.
    }
    res.render("campgrounds/show", { campground });
  })
);
// 클릭한 해당 링크의 id를 받아옴

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "캠핑장을 찾을 수 없습니다");
      res.redirect("/campgrounds");
      // 한 캠핑장을 북마크에 저장해놓고 삭제하거나 해서 주소가 사라졌을 경우, 에러를 띄우는 대신 campgrounds로 리다이렉트 해주며 error alert를 띄움.
    }
    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground, // 이 부분 중괄호로 감싸야 작동함
    });
    req.flash("update", "캠핑장이 업데이트되었습니다."); //플래시 생성
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("del", "캠핑장이 삭제되었습니다."); //플래시 생성
    res.redirect("/campgrounds");
  })
);

module.exports = router;
