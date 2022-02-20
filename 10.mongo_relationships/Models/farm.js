const mongoose = require("mongoose");
const { Schema } = mongoose;
main()
  .then(() => {
    console.log("CONNECT OPEN");
  })
  .catch((err) => {
    console.log("NO CONNECT");
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://localhost:27017/relationshipDemo");
}
const productSchema = new Schema({
  name: String,
  price: Number,
  season: {
    type: String,
    enum: ["Spring", "Summer", "Fall", "Winter"],
  },
});

const farmSchema = new Schema({
  name: String,
  city: String,
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product", // populate를 사용할 때 ref는 반드시 필요하다. 들어가는 값은 .model 명.
    },
  ],
});

const Product = mongoose.model("Product", productSchema);
const Farm = mongoose.model("Farm", farmSchema);

// Product.insertMany([
//   { name: "ㅇㅇ", price: 5, season: "Spring" },
//   {
//     name: "ss",
//     price: 12,
//     season: "Summer",
//   },
// ]);
const makeNewFarm = async () => {
  const farm = new Farm({
    name: "농장1",
    city: "대전",
  });
  const ss = await Product.findOne({ name: "ss" }); // node시 cmd에는 products에 ss의 모든 정보를 보여주는 것으로 나타나지만, 실제 mongodb에는 "products" : [ObjectId] 이다. 상품 자체에 대한 정보는 전혀 없고 오직 id만 있다.
  farm.products.push(ss);
  // console.log(farm);
  await farm.save();
};

const addProduct = async () => {
  const farm = await Farm.findOne({ name: "농장1" });
  const dd = await Product.findOne({ name: "ㅇㅇ" });
  farm.products.push(dd);
  await farm.save();
  // console.log(farm);
};

Farm.findOne({ name: "농장1" })
  .populate("products") // populate를 해주면 node했을 때 "products" : [ObjectId,ObjectId]였던 결과가 모든 정보를 받아서 출력된다.
  .then((farm) => console.log(farm));

// one to many
