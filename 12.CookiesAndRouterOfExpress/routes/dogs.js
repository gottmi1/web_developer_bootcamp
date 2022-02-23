const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("독");
});

router.post("/", (req, res) => {
  res.send("독 만들기");
});

router.get("/:id", (req, res) => {
  res.send("독 하나 보기");
});

router.get("/:id/edit", (req, res) => {
  res.send("독 수정");
});

module.exports = router;
