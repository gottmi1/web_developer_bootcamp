const express = require("express");
const router = express.Router();

router.use((req, res, next) => {
  if (req.query.isAdmin) {
    next();
  }
  res.send("어드민이 아니시네요");
}); // 이렇게 한 경로에서만 실행되는 미들웨어를 만들수도 있다.

router.get("/topsecret", (req, res) => {
  res.send("전 사실 공부가 하기 싫어요");
});

module.exports = router;
