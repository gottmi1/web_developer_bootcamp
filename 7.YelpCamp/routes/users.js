const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { userSchema } = require("../schemas.js");
const passport = require("passport");

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ username, email });
      const registerUser = await User.register(user, password);
      req.login(registerUser, (err) => {
        // 회원가입 후 따로 로그인할 필요 없이 자동으로 로그인되게 해주는 헬퍼메서드
        if (err) return next(err);
        req.flash("success", `환영합니다`);
        res.redirect("/campgrounds");
      });
    } catch (e) {
      console.log(e);
      req.flash("error", "잘못된 값이 있습니다 다시 시도해주세요");
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  // authenticate(헬퍼 메서드)에는 여러가지 기능이 있는데 여기서 사용된 기능은 실패했을 때를 대비해 플래시,리다이렉트를 미리 지정해준 것
  (req, res) => {
    req.flash("success", "어서오세요!");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    // 직전에 로그인을 요구한 url로 바로 보낸다
    delete req.session.returnTo;
    // 그 후 returnTo 기록을 삭제해줌
    res.redirect(redirectUrl);
  }
);
// passport를 사용한 로그인 기능 구현

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "로그아웃 되었습니다");
  res.redirect("/campgrounds");
});

module.exports = router;
