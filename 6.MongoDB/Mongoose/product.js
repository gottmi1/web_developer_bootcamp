const mongoose = require("mongoose");

main()
  .then(() => {
    console.log("CONNECT OPEN");
  })
  .catch((err) => {
    console.log(err);
    console.log("NO CONNECT");
  });

async function main() {
  await mongoose.connect("mongodb://localhost:27017/shopApp");
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20,
    minlength: 5,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "가격은 양수여야 해요"], // 해당 조건을 충족하지 않을때의 에러메세지를 직접 정한다
  },
  onSale: {
    type: Boolean,
    default: false,
  },
  // categories: [String], // 문자열로 구성된 배열만 허용 만약 여기에 숫자가 들어가면 Number가 아니라 문자열 숫자로 보여줌(에러는 안 남)
  categories: {
    // 이렇게 더 자세하게 값을 줄 수도 있다. 근데 굳이 이렇게 쓸 필요는 없음
    type: [String],
    default: ["Cycling"],
  },
  qty: {
    online: {
      type: Number,
      default: 0,
    },
    inStore: {
      type: Number,
      default: 0,
    },
  },
  size: {
    type: String,
    enum: ["S", "M", "L"], // 유효한 값의 그룹을 지정해줄 수 있다
  },
});

productSchema.methods.greet = function () {
  console.log(`- ${this.name}`);
};

productSchema.methods.toggleOn = function () {
  this.onSale = !this.onSale;
  return this.save();
};

productSchema.methods.addCategory = function (newCat) {
  this.categories.push(newCat);
  return this.save();
};

productSchema.methods.removeCategory = function () {
  this.categories.pop();
  return this.save();
};

const Product = mongoose.model("Product", productSchema);

productSchema.statics.fireSale = function () {
  return this.updateMany({}, { onSale: ture, price: 0 });
};

const findProduct = async () => {
  const foundProduct = await Product.findOne({ name: "Mountain Bike" });
  console.log(foundProduct);
  await foundProduct.toggleOn();
  console.log(foundProduct);
  await foundProduct.addCategory("good...");
  console.log(foundProduct);
};

// findProduct();
Product.fireSale().then((res) => console.log(res));

// const bike = new Product({
//   name: "Mountain Bike",
//   price: "59.9", // 문자열로 전달해도 숫자면 상관없음
//   categories: ["Safety", "Cycling"],
//   size: "S",
// });
// bike
//   .save()
//   .then((data) => {
//     console.log("it worked!");
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log("oh no error!");
//     console.log(err);
//   });

// Product.findOneAndUpdate(
//   { name: "Mountain Bike" },
//   { price: -100 },
//   { new: true, runValidators: true }
// )
//   .then((data) => {
//     console.log("it worked!");
//     console.log(data);
//   })
//   .catch((err) => {
//     console.log("oh no error!");
//     console.log(err);
//   });
