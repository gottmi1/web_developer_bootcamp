const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams를 하면 라우터를 사용할 때 req.params가 빈 객체인 상황을 해결할 수 있다.
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/Campground");
const Review = require("../models/review");
const { isLoggedIn, validateReivew, isReviewAuthor } = require("../middleware");
const Reviews = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReivew, catchAsync(Reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(Reviews.deleteReview)
);

module.exports = router;
