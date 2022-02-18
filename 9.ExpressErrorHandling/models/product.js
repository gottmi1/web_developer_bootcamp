const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
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
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
