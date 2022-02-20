const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const AppError = require("./AppError");

const Product = require("./models/product");
const Farm = require("./models/farm");

main()
  .then(() => {
    console.log("CONNECT OPEN");
  })
  .catch((err) => {
    console.log("NO CONNECT");
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://localhost:27017/farmStandTake2");
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Farm Routes

app.get("/farms", async (req, res) => {
  // async await을 사용하지 않았을 때의 결과 Converting circular structure to JSON --> starting at object with constructor 'Topology' | property 's' -> object with constructor 'Object' | property 'sessionPool' -> object with constructor 'ServerSessionPool' --- property 'topology' closes the circle
  const farms = await Farm.find({});
  res.render("farms/index", { farms });
});

app.get("/farms/new", (req, res) => {
  // 단순한 렌더링이기 때문에 async가 필요없음.
  res.render("farms/new");
});

app.get("/farms/:id", async (req, res) => {
  const farms = await Farm.findById(req.params.id).populate("products");
  // console.log(farms);
  res.render(`farms/show`, { farms });
});

app.delete("/farms/:id", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findByIdAndDelete(id);
  res.redirect("/farms");
});

app.post(
  "/farms",
  wrapAsync(async (req, res) => {
    // res.send(req.body);
    // req.body의 내용형식 {"name":"","city":"","email":""}
    const farm = new Farm(req.body); // req.body의 내용을 가지고 새로운 Farm을 만든다
    await farm.save(); // 저장
    res.redirect(`/farms`);
  })
);

app.get("/farms/:id/products/new", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id);
  res.render("products/new", { categories, farm });
});

app.post("/farms/:id/products", async (req, res) => {
  const { id } = req.params;
  const farm = await Farm.findById(id); // 새로 만들 때는 new, 찾을 때는 await
  const { name, price, category } = req.body;
  const product = new Product({ name, price, category });
  farm.products.push(product);
  product.farm = farm;
  await farm.save(); //farm의 proudcts와
  await product.save(); // product의 farm에 같은 내용이 삽입되었다.
  res.redirect(`/farms/${id}`); // mongo에서 가져온 아이디를 쓰고있음을 자세하게 표시하는 게 좋다.
});

// Product Routes
const categories = ["fruit", "vegetable", "dairy"];

app.get(
  "/products",
  wrapAsync(async (req, res, next) => {
    const { category } = req.query;
    if (category) {
      const products = await Product.find({ category: category });
      res.render("products/index", { products, category });
    } else {
      const products = await Product.find({});
      res.render("products/index", { products, category: "All" }); // 디폴트 값을 설정해줘서 카테고리가 없을 때 all이 보이게 한다
    }
  })
); // 카테고리가 있는 경우, 해당 카테고리를 포함한 것만 출력, else(카테고리가 없을 때) 모두 출력

app.get("/products/new", (req, res) => {
  // throw new AppError("권한이없다굿", 401);
  res.render("products/new", { categories });
});

// Create
app.post(
  "/products",
  wrapAsync(async (req, res, next) => {
    const newProduct = new Product(req.body);
    await newProduct.save();
    // console.log(newProduct);
    res.redirect(`/products/${newProduct._id}`);
  })
);

function wrapAsync(fn) {
  // 매개변수 fn은 일반적으로 함수를 매개변수로 받겠다는 의미로 쓰인다.
  return function (req, res, next) {
    fn(req, res, next).catch((e) => next(e));
  };
}
// 상당히 어려운 수준이라고 함. 요점은 함수를 만들어서 async 콜백을 wrap하여 try,catch를 매번 타이핑하지 않을 수도 있다는 것.
// 동작 : 에러가 있으면 catch를 추가하고 next를 호출
// Express에서 모든 async함수는 반드시 try catch next를 해야만 하기때문에 이해하진 못해도 머리속에 집어넣어야 한다고 한다.
app.get(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id).populate("farm", "name"); // 찾은 id 안에서 farm의 name만 가지고온다
    console.log(product);
    if (!product) {
      throw AppError("show 그런건 없다", 404);
    }
    res.render("products/show", { product });
  })
);

//Edit form
app.get(
  "/products/:id/edit",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      // return next(new AppError("eidt 그런건 없다", 404)); 이렇게 retrun해서 끝내 버리는 대신  --- 비동기 에러핸들링 방법 1 if를 사용하는 방법
      throw AppError("eidt 그런건 없다", 404);
    }
    res.render("products/edit", { product, categories });
  })
);

// Update
app.put(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
    });
    // console.log(req.body);
    res.redirect(`/products/${product._id}`);
  })
);
// 비동기 에러핸들링 방법 2 try&catch를 사용하는 방법

// Delete
app.delete(
  "/products/:id",
  wrapAsync(async (req, res, next) => {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    // const deletedFarmProducts = await Farm.findByIdAndDelete(id);
    // console.log(req.params);
    res.redirect("/products");
  })
);

const handleValidateionErr = (err) => {
  console.dir(err);
  return new AppError(`에러가났다 에러가났어${err.message}`, 400);
};

app.use((err, req, res, next) => {
  console.log(err.name);
  if (err.name === "ValidationError") {
    err = handleValidateionErr(err);
  }
  next(err);
});

app.use((err, req, res, next) => {
  const { status = 500, message = "에러났음" } = err;
  res.status(status).send(message);
});

app.listen(3000, () => {
  console.log("App is port 3000");
});
