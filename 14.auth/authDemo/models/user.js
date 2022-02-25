const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "유저 네임을 입력해주세요"],
  },
  password: {
    type: String,
    required: [true, "페스워드를 입력해주세요"],
  },
});

module.exports = mongoose.model("User", userSchema);
