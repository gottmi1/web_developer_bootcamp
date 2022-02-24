const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams를 하면 라우터를 사용할 때 req.params가 빈 객체인 상황을 해결할 수 있다.
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/Campground");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas.js");

// ---------------------------------------------------- 미들웨어 함수
const validateReivew = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    //result에 error가 존재하면 에러를 throw한다
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 404);
  } else {
    // 그렇지 않으면 이 함수의 뒤에 올 함수를 실행시킴
    next();
  }
};
// ---------------------------------------------------- 미들웨어 함수

router.post(
  "/",
  validateReivew,
  catchAsync(async (req, res) => {
    console.log(req.params);
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // 인자로 객체를 넣기 위해 pull오퍼레이터를 사용한다.  몽고 배열에서 값을 제거할 때 사용할 수 있는 방법이다. 아이디를 꺼낼 때 어떤 값들을 아이디와 함께 꺼내오게 할 수 있다. reviews = id가 담긴 배열
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
