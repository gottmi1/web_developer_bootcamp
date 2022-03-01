module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    // returnTo : 사용자를 다시 리디렉션할 url을 설정
    req.flash("error", "로그인 후 이용 가능합니다");
    return res.redirect("/login");
  } // 사용자가 권한이 있는지 확인한 후 없으면 로그인페이지로 되돌려보낸다
  next();
};
