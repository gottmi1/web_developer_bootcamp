const bcrypt = require("bcrypt");
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

// 미들웨어 추가
userSchema.statics.findAndValidate = async function (username, password) {
  const foundUser = await this.findOne({ username }); // 인자로 받은 username을 찾는다
  const isValid = await bcrypt.compare(password, foundUser.password); // 인자로 받은 password와 foundUser의 password가 같은지 확인(compare은 true혹은 false를 반환)
  return isValid ? foundUser : false; // isValid가 true라면 foundUser를 false로 한다
};
userSchema.pre("save", async function (next) {
  if (!this.isModefied("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model("User", userSchema);
