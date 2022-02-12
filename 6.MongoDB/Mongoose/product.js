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
    min: 0,
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
});

const Product = mongoose.model("Product", productSchema);

const bike = new Product({
  name: "Mountain Bike",
  price: "599", // 문자열로 전달해도 숫자면 상관없음
  categories: ["Safety", "Cycling"],
});
bike
  .save()
  .then((data) => {
    console.log("it worked!");
    console.log(data);
  })
  .catch((err) => {
    console.log("oh no error!");
    console.log(err);
  });
