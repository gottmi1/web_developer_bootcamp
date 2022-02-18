const mongoose = require("mongoose");
const Product = require("./models/product");

async function main() {
  await mongoose.connect("mongodb://localhost:27017/farmStand2");
}

main()
  .then(() => {
    console.log("CONNECT OPEN");
  })
  .catch((err) => {
    console.log("NO CONNECT");
    console.log(err);
  });

// const p = new Product({
//   name: "Grapefruit",
//   price: 1.99,
//   category: "fruit",
// });
// p.save()
//   .then((p) => console.log(p))
//   .catch((e) => console.log(e));

const seedProducts = [
  {
    name: "Fairy Eggplant",
    price: 1.0,
    category: "vegetable",
  },
  {
    name: "Organic Goddess Melon",
    price: 4.99,
    category: "fruit",
  },
  {
    name: "Organic Mini Seedless Watermelon",
    price: 3.99,
    category: "fruit",
  },
  {
    name: "Organic Celery",
    price: 1.5,
    category: "vegetable",
  },
  {
    name: "Chocolate Whole Milk",
    price: 2.69,
    category: "dairy",
  },
]; // 유효성 검사를 통과하지 못한 것은 기본적으로 아무것도 삽입되지 않는다. mongoose는 어떤 것이든 삽입되기 전에 모든 것음 검증하고, 그 다음 삽입한다.
Product.insertMany(seedProducts)
  .then((res) => console.log(res))
  .catch((e) => console.log(e));
// 여기서 then,catch는 cmd에 결과가 성공인지 실패인지 출력하기 위한것 뿐임

//seeds.js를
// >node
// .load seeds.js로 실행시킬 때 코드에 따라 db에 정보를 insert하거나 delete한다.
