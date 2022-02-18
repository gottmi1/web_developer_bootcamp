// const express = require("express");
// const app = express();
// const morgan = require("morgan");

// const AppError = require("./AppError");

// app.use(morgan("dev")); // 맨 마지막에 뜸

// app.use((req, res, next) => {
//   req.requestTime = Date.now();
//   console.log(req.method, req.path);
//   next();
// });

// app.use("/dogs", (req, res, next) => {
//   console.log("난 개가 좋아");
//   next(); // 안 하면 경로로 가지지 않음
// });

// const verifyPassword = (req, res, next) => {
//   const { password } = req.query;
//   if (password === "abcd") {
//     next();
//   }
//   // res.send("패스워드가 필요해");
//   throw new AppError("패스워드 내놔", 401);
//   // 스테이터스 코드 401 : 누군지 몰라서 권한 없음
// };

// // app.use((req, res, next) => {
// //   // 기본적으로 세번째 매개변수로 정해져있다. req,res를 쓸 일이 없어도 next를 쓰려면 세번째 매개변수로 만들어줘야 함. next는 다음에 매칭되는 미들웨어 혹은 root hanlder를 호출하는 함수이다.
// //   console.log("첫번째 미들웨어");
// //   next();
// // });
// // app.use((req, res, next) => {
// //   console.log("두번째 미들웨어");
// //   next();
// // });
// //  morgan의 작동방식은 reponse시간까지 기다리기 떄문에 항상 마지막에 옴. next()가 없으면 거기서 실행을 멈춘다.

// app.get("/", (req, res) => {
//   console.log(`Request time : ${req.requestTime}`);
//   res.send("home");
// });

// app.get("/error", (req, res) => {
//   chicken.fly();
// });

// app.get("/dogs", (req, res) => {
//   console.log(`Request time : ${req.requestTime}`);
//   res.send("멍멍");
// });

// app.get("/secret", verifyPassword, (req, res) => {
//   // 이렇게 하면 verifyPassword에서 next()가 실행 됐을 때(비밀번호가 맞을 때)만 뒤의 콜백함수를 실행할 수 있음.
//   //
//   res.send("어케맞췄노");
// });

// app.get("/admin", (req, res) => {
//   throw new AppError("관리자가 아닙니다", 403);
// });

// app.use((req, res) => {
//   res.status(404).send("NOT FOUND");
// });
// // 정해지지 않은 경로로 갔을 때 항상 이게 뜸

// // app.use((err, req, res, next) => {
// //   console.log("**********************");
// //   console.log("********error*********");
// //   console.log("**********************");
// //   // 홈페이지가 멈추고 bash에 console.log한 게 뜸
// //   // res.status(500).send("에러입니다"); // send를 홈페이지에 뭐가 뜨기라도 한다
// //   console.log(err);
// //   next(err);
// //   // 여기서 next를 실행시키면 에러를 무시하고 다음 미들웨어를 자동으로 호출한다.
// // });

// app.use((err, req, res, next) => {
//   const { status = 500, message = "에러 디폴트 값" } = err; // 디폴트 값이 없으면 에러가 발생함
//   res.status(status).send(message);
// });

// app.listen(3000, () => {
//   console.log("connected");
// });

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const AppError = require("./AppError");

const Product = require("./models/product");

main()
  .then(() => {
    console.log("CONNECT OPEN");
  })
  .catch((err) => {
    console.log("NO CONNECT");
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://localhost:27017/farmStand2");
}

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const categories = ["fruit", "vegetable", "dairy"];

app.get("/products", async (req, res, next) => {
  try {
    const { category } = req.query;
    if (category) {
      const products = await Product.find({ category: category });
      res.render("products/index", { products, category });
    } else {
      const products = await Product.find({});
      res.render("products/index", { products, category: "All" }); // 디폴트 값을 설정해줘서 카테고리가 없을 때 all이 보이게 한다
    }
  } catch (e) {
    next(e);
  }
}); // 카테고리가 있는 경우, 해당 카테고리를 포함한 것만 출력, else(카테고리가 없을 때) 모두 출력

app.get("/products/new", (req, res) => {
  // throw new AppError("권한이없다굿", 401);
  res.render("products/new", { categories });
});

// Create
app.post("/products", async (req, res, next) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    // console.log(newProduct);
    res.redirect(`/products/${newProduct._id}`);
  } catch (e) {
    next(e);
  }
});

app.get("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      throw AppError("show 그런건 없다", 404);
    }
    res.render("products/show", { product });
  } catch (e) {
    next(e);
  }
});

//Edit form
app.get("/products/:id/edit", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      // return next(new AppError("eidt 그런건 없다", 404)); 이렇게 retrun해서 끝내 버리는 대신  --- 비동기 에러핸들링 방법 1 if를 사용하는 방법
      throw AppError("eidt 그런건 없다", 404);
    }
    res.render("products/edit", { product, categories });
  } catch (e) {
    next(e);
  }
});

// Update
app.put("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
    });
    // console.log(req.body);
    res.redirect(`/products/${product._id}`);
  } catch (e) {
    next(e);
  }
});
// 비동기 에러핸들링 방법 2 try&catch를 사용하는 방법

// Delete
app.delete("/products/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    // console.log(req.params);
    res.redirect("/products");
  } catch (e) {
    next(e);
  }
});

app.use((err, req, res, next) => {
  const { status = 500, message = "에러났음" } = err;
  res.status(status).send(message);
});

app.listen(3000, () => {
  console.log("App is port 3000");
});
