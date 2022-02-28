const express = require("express");
const app = express();
const User = require("./models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/authDemo");
}

app.use(express.urlencoded({ extended: true })); // req.bdoy에 접근하기 위해 필요.
app.use(session({ secret: "yoyo" }));

const requireLogin = (req, res, next) => {
  // req.session에 user_id가 있는지 확인하는 미들웨어 함수
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  next();
};

app.set("view engine", "ejs");
app.set("views", "views");

app.get("/", (req, res, next) => {
  res.send("후");
});

app.get("/register", (req, res, next) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  // const hash = await bcrypt.hash(password, 15);
  // const user = new User({
  //   username, // 이건 그대로 저장
  //   password: hash,
  // });
  const user = new User({ username, password });
  await user.save();
  // password를 salt하고, db에 저장할 땐 salt한 값이 들어가도록 해줌
  req.session.user_id = user._id;
  // 회원가입을 하면 즉시 로그인상태이기 때문에 여기도 추가해준다.
  res.redirect("/secret");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  // const user = await User.findOne({ username });
  // const validPassword = await bcrypt.compare(password, user.password);
  const foundUser = await User.findAndValidate(username, password);
  if (foundUser) {
    req.session.user_id = foundUser._id;
    // session에 id를 추가하여 로그인 상태라는 것을 검증한다
    res.redirect("/secret");
  } else {
    res.redirect("/login");
  }
});

app.post("/logout", (req, res) => {
  req.session.user_id = null; //인증을 위해 필요한 최소한의 값 = 사용자 id추적
  // req.session.destroy() 한 프로퍼티만 제거하지 않고 모든것을 제거하는 메서드
  res.redirect("/login");
});
// 로그아웃 개념 = 간단하게 req.session에서 user_id를 지워주는 것

app.get("/secret", requireLogin, (req, res) => {
  // if (!req.session.user_id) {
  //   return res.redirect("/login");
  //   // user_id 값이 없다면 login화면으로 돌려보낸다
  // } 미들웨어 함수를 정의했으므로 미들웨어 함수에서 처리한다
  res.render("secret");
});

app.listen(3000, () => {
  console.log("3000 서빙중");
});
