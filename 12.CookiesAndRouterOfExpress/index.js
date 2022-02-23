const express = require("express");
const app = express();
const shuelterRouter = require("./routes/shelters");
const dogsRouter = require("./routes/dogs");
const adminRouter = require("./routes/admin");

app.use("/jinwon", shuelterRouter); // 여기에 기본경로인 shelter를 사용하면 shelters.js에서 의 경로를 일일이 적지 않아도 된다.
app.use("/dogs", dogsRouter);
app.use("/admin", adminRouter);

app.listen(3000, () => {
  console.log("localhost 3000에서 서빙");
});
