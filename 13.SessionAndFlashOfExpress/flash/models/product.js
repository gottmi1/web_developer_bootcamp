const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "이름을 비우지 마세요"], // 뒤에 오는 문자열은 ValidationError의 name이다.
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    enum: ["fruit", "vegetable", "dairy"],
    lowercase: true,
  },
  farm: {
    type: Schema.Types.ObjectId,
    ref: "Farm", // 서로 레퍼런스 해주는 내용이 필드 안에 있다
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
