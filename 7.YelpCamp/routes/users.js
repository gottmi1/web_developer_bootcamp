const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { userSchema } = require("../schemas.js");
const passport = require("passport");
const users = require("../controllers/users");

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    // authenticate(헬퍼 메서드)에는 여러가지 기능이 있는데 여기서 사용된 기능은 실패했을 때를 대비해 플래시,리다이렉트를 미리 지정해준 것
    users.login
  ); // passport를 사용한 로그인 기능 구현

router.get("/logout", users.logout);

module.exports = router;
