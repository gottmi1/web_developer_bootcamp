const Campground = require("../models/Campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "리뷰가 등록되었습니다."); //플래시 생성
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // 인자로 객체를 넣기 위해 pull오퍼레이터를 사용한다.  몽고 배열에서 값을 제거할 때 사용할 수 있는 방법이다. 아이디를 꺼낼 때 어떤 값들을 아이디와 함께 꺼내오게 할 수 있다. reviews = id가 담긴 배열
  await Review.findByIdAndDelete(reviewId);
  req.flash("del", "리뷰가 삭제되었습니다.");
  res.redirect(`/campgrounds/${id}`);
};
