const express = require("express");
const app = express();
const morgan = require("morgan");

app.use(morgan("dev")); // 맨 마지막에 뜸

app.use((req, res, next) => {
  req.requestTime = Date.now();
  console.log(req.method, req.path);
  next();
});

app.use("/dogs", (req, res, next) => {
  console.log("난 개가 좋아");
  next(); // 안 하면 경로로 가지지 않음
});

const verifyPassword = (req, res, next) => {
  const { password } = req.query;
  if (password === "abcd") {
    next();
  }
  res.send("패스워드가 필요해");
};

// app.use((req, res, next) => {
//   // 기본적으로 세번째 매개변수로 정해져있다. req,res를 쓸 일이 없어도 next를 쓰려면 세번째 매개변수로 만들어줘야 함. next는 다음에 매칭되는 미들웨어 혹은 root hanlder를 호출하는 함수이다.
//   console.log("첫번째 미들웨어");
//   next();
// });
// app.use((req, res, next) => {
//   console.log("두번째 미들웨어");
//   next();
// });
//  morgan의 작동방식은 reponse시간까지 기다리기 떄문에 항상 마지막에 옴. next()가 없으면 거기서 실행을 멈춘다.

app.get("/", (req, res) => {
  console.log(`Request time : ${req.requestTime}`);
  res.send("home");
});

app.get("/dogs", (req, res) => {
  console.log(`Request time : ${req.requestTime}`);
  res.send("멍멍");
});

app.get("/secret", verifyPassword, (req, res) => {
  // 이렇게 하면 verifyPassword에서 next()가 실행 됐을 때(비밀번호가 맞을 때)만 뒤의 콜백함수를 실행할 수 있음.
  //
  res.send("어케맞췄노");
});

app.use((req, res) => {
  res.status(404).send("NOT FOUND");
});
// 정해지지 않은 경로로 갔을 때 항상 이게 뜸

app.listen(3000, () => {
  console.log("connected");
});
