const express = require("express");
const app = express();
const User = require("./models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/authDemo");
}

app.use(express.urlencoded({ extended: true })); // req.bdoy에 접근하기 위해 필요. 패스

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
  // 그냥 디스쳐럭터링
  const hash = await bcrypt.hash(password, 15);
  const user = new User({
    username, // 이건 그대로 저장
    password: hash,
  });
  await user.save();
  // password를 salt하고, db에 저장할 땐 salt한 값이 들어가도록 해줌
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  const validPassword = await bcrypt.compare(password, user.password);
  if (validPassword) {
    res.send("로그인 성공");
  } else {
    res.send("아이디나 비밀번호가 틀렸어");
  }
});

app.get("/secret", (req, res) => {
  res.send("로그인 하지 않으면 볼수 없다");
});

app.listen(3000, () => {
  console.log("3000 서빙중");
});
