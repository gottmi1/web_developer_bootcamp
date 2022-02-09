const express = require("express");
const app = express();
console.dir(app);

// app.use((req, res) => {
//   // 요청과 응답 두개의 args를 가진다
//   console.log("we got a new request"); // 터미널에서만 확인 가능
//   // res.send("we got tour request! this is response!"); // 실제로 localhost:8080에 괄호 안의 문자열이 뜬다.
//   res.send("This is my webpage");
// });

// app.get은 get리퀘스트에 반응하고 app.post는 post리퀘스트에 반응하고 그런 건가 봄
app.get("/", (req, res) => {
  // /는 루트 라우트라고 함. root페이지라고 본다.
  console.log("home request");
  res.send("this is home!!!!");
});

app.get("/r/:subreddit", (req, res) => {
  const { subreddit } = req.params;
  res.send(`Browsing the ${subreddit}`);
});

app.get("/r/:subreddit/:postId", (req, res) => {
  // 여기서 콜론은 변수임을 나타낸다. 하드코딩이 아님.
  res.send(`Viewing post id : ${postId} the ${subreddit}`);
});

app.post("/cats", (req, res) => {
  res.send("post req to /cats!");
});

app.get("/cats", (req, res) => {
  console.log("cat request");
  res.send("this is cats");
});

app.get("/dogs", (req, res) => {
  console.log("dog request");
  res.send("this is dogs");
});

app.get("/search", (req, res) => {
  const { q } = req.query;
  if (!q) {
    res.send("notthing found");
  }
  res.send(`<h1>Search results for : ${q}</h1>`);
});

app.get("*", (req, res) => {
  // "*"을 사용하면 지정한 것 외의 다른 것이 들어갔을 때의 응답을 지정할 수 있다. app.get 중에 제일 마지막에 와야 함. 안 그러면 이 뒤에 오는 app.get들이 다 무시된다고 한다.
  res.send("i don't know");
});

app.listen(8080, () => {
  console.log("listening on port 8080");
});
