const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/Campground");
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

router.route("/").get(catchAsync(campgrounds.index)).post(
  isLoggedIn,
  validateCampground, // 앞서 만든 미들웨어 함수
  catchAsync(campgrounds.createCampground)
);
// 같은 path를 공유하는 다른 타입의 요청은 .route("path")로 한번에 적을 수 있다. 이때, 원래 있던 path들은 지워줘야 함.

router.get("/new", isLoggedIn, campgrounds.renderNewForm);
// campgrounds/:id 아래에 두면 new를 id로 인식하기 때문에 위에둬야 함.

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
