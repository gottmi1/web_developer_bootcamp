const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const farmSchema = new Schema({
  name: {
    type: String,
    required: [true, "농장의 이름이 필요합니다"],
  },
  city: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "이메일이 필요합니다"],
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product", // 서로 레퍼런스 해주는 내용이 필드 안에 있다
    },
  ],
});

const Farm = mongoose.model("Farm", farmSchema);

module.exports = Farm;
