const { campgroundSchema, reviewSchema } = require("./schemas.js");
const Campground = require("./models/Campground");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    // returnTo : 사용자를 다시 리디렉션할 url을 설정, 이 경우 로그인을 완료하면 바로 전 작업으로 되돌림
    req.flash("error", "로그인 후 이용 가능합니다");
    return res.redirect("/login");
  } // 사용자가 권한이 있는지 확인한 후 없으면 로그인페이지로 되돌려보낸다
  next();
};

module.exports.validateCampground = (req, res, next) => {
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

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  // url에서 아이디를 가져와 해당 아이디로 campground를 찾는다
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "권한이 없습니다!");
    return res.redirect(`/campgrounds/${id}`);
  }
  // 현재 접속한 id와 보고있는 캠핑장의 author가 다를 경우 post접근을 막는다
  next();
};

module.exports.validateReivew = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    //result에 error가 존재하면 에러를 throw한다
    // const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError("리뷰 점수를 선택해주세요", 404);
  } else {
    // 그렇지 않으면 이 함수의 뒤에 올 함수를 실행시킴
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params; // isAuthor와 가져오는 것이 다름
  // 삭제하는 경로가 campgrounds/:id/reveiws/:reviewId이기 때문에 둘 다 가져와야 한다
  const review = await Review.findById(reviewId);
  // url에서 아이디를 가져와 해당 아이디로 campground를 찾는다
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "권한이 없습니다!");
    return res.redirect(`/campgrounds/${id}`);
  }
  // 현재 접속한 id와 보고있는 캠핑장의 author가 다를 경우 post접근을 막는다
  next();
};
