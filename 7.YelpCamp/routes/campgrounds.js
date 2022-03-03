const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/Campground");
const campgrounds = require("../controllers/campgrounds");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");

const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });
// cloudinary저장소를 사용해 이미지를 저장하고 그 url을 mongodb로 받을 수 있다.

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateCampground,
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
    upload.array("image"),
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
