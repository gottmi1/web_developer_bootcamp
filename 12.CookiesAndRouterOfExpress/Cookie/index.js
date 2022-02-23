const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser("password"));

app.get("/greet", (req, res) => {
  const { name = "무명" } = req.cookies;
  res.send(`안녕 ${name}`);
});

app.get("/setname", (req, res) => {
  res.cookie("name", "jinwon"); // 쿠키를 보내는 방법. 첫 번째 값은 key값이고 뒷 값은  value값임
  res.send("쿠키 보내드렷습니다");
});

app.get("/getsignedcookie", (req, res) => {
  res.cookie("fruit", "grape", { signed: true }); // signed : true를 추가하면 쿠키파서를 사용하여 특정 값을 전달할 경우에만 존재하게 된다.
  res.send("쿠키에 ㅅ ㅓ명하십시오");
});

app.get("/fruit", (req, res) => {
  console.log(req.signedCookies);
  res.send(req.signedCookies);
});

app.listen(3000, () => {
  console.log("서빙중");
});
