const User = require("../models/User");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

module.exports.register = async (req, res, next) => {
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
};

module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", "어서오세요!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  // 직전에 로그인을 요구한 url로 바로 보낸다
  delete req.session.returnTo;
  // 그 후 returnTo 기록을 삭제해줌
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "로그아웃 되었습니다");
  res.redirect("/campgrounds");
};
