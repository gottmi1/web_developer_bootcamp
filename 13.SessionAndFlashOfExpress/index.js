const express = require("express");
const session = require("express-session");
const app = express();

const sessionOption = {
  secret: "jinwon",
  resave: false,
  saveUninitialized: false,
};

app.use(session(sessionOption)); // 아무것도 하지 않고 세션 미들웨어를 사용하기만 해도 자동으로 connext.sid라는 쿠키를 보내온다.

// 이 페이지를 본 횟수를 저장한다
app.get("/viewcount", (req, res) => {
  if (req.session.count) {
    req.session.count += 1;
  } else {
    req.session.count = 1;
  }
  res.send(`이 페이지를 ${req.session.count}회 봤습니다`);
});

app.get("/register", (req, res) => {
  // 이 곳을 경우해서 가면 username은 unname이 됨
  const { username = "unname" } = req.query;
  req.session.username = username;
  res.redirect("/greet");
});

app.get("/greet", (req, res) => {
  // 실행 후 바로 여기로 가면 undefiend를 반환
  const { username } = req.session;
  res.send(`${username} 안녕?`);
});

app.listen(3000, () => {
  console.log("localhost 3000 서빙중");
});
