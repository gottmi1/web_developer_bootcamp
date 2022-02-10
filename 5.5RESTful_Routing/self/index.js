const express = require("express");
const app = express();
const path = require("path");
const { v4: uuid } = require("uuid");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
// 요청마다 코드나 기능을 실행하는 방법
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

let comments = [
  { id: uuid(), username: "진원", comment: "언제 취업하냐1" },
  { id: uuid(), username: "진투", comment: "언제 취업하냐2" },
  { id: uuid(), username: "진쓰리", comment: "언제 취업하냐3" },
  { id: uuid(), username: "진포", comment: "언제 취업하냐4" },
];

app.get("/comments", (req, res) => {
  res.render("comments/index", { comments });
});
// Read
app.get("/comments/new", (req, res) => {
  res.render("comments/new", { comments });
});
app.post("/comments", (req, res) => {
  const { username, comment } = req.body;
  comments.push({ username, comment, id: uuid() });
  res.redirect("/comments");
});
// Create
app.get("/comments/:id", (req, res) => {
  const { id } = req.params;
  const comment = comments.find((c) => c.id === id);
  res.render("comments/show", { comment });
});
// Detale Read

app.get("/comments/:id/edit", (req, res) => {
  const { id } = req.params;
  const comment = comments.find((c) => c.id === id);
  res.render("comments/edit", { comment }); // 빈 창이 아니라 원래 댓글의 내용도 가져오기 위함
});

app.patch("/comments/:id", (req, res) => {
  const { id } = req.params;
  const newCommentText = req.body.comment;
  const foundComment = comments.find((c) => c.id === id);
  foundComment.comment = newCommentText;
  res.redirect("/comments");
});
// Update

app.delete("/comments/:id", (req, res) => {
  const { id } = req.params;
  comments = comments.filter((c) => c.id != id);
  res.redirect("/comments");
});
// Delete

app.get("/tacos", (req, res) => {
  res.send("GET /tacos response ");
});

app.post("/tacos", (req, res) => {
  const { meat, qty } = req.body;
  console.log(meat, qty);
  res.send(`here are your ${qty} ${meat} tacos.`);
});

app.listen(3000, () => {
  console.log("ON Port 3000");
});
