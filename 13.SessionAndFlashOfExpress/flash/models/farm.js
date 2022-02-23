const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Product = require("./product");

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

// 삭제하는 미들웨어를 만든다
// farmSchema.pre("findOneAndDelete", async function (data) {
//   console.log("pre 미들웨어");
//   console.log(data);
// }); // pre 미들웨어는 삭제되는 농장에 접근할 수 있는 권한이 없다.
// findByIdAndDelete 했을 때 각각
// pre 미들웨어
// [Function (anonymous)]
farmSchema.post("findOneAndDelete", async function (farm) {
  if (farm.products.length) {
    const res = await Product.deleteMany({ _id: { $in: farm.products } }); // $in을 사용해서 안에 있는 전부를 삭제시킬 수 있다.
    console.log(res);
  }
});

const del = async (req, res) => {
  await Product.deleteMany();
};
// farmSchema.post("findOneAndDelete", async function (data) {
//   console.log("post 미들웨어");
//   console.log(data);
// });
// post 미들웨어
// {
//   _id: new ObjectId("6212969d2afa4a32b80eb9e7"),
//   name: '삭제할 농장',
//   city: '우주',
//   email: 'dd',
//   products: [],
//   __v: 0
// }
// 가 출력됨.

const Farm = mongoose.model("Farm", farmSchema);

module.exports = Farm;
