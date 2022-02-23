const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("쉘터");
});

router.post("/", (req, res) => {
  res.send("쉘터 만들기");
});

router.get("/:id", (req, res) => {
  res.send("쉘터 하나 보기");
});

router.get("/:id/edit", (req, res) => {
  res.send("쉘터 수정");
});

module.exports = router;
