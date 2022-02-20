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

const userSchema = new Schema({
  username: String,
  age: Number,
});
// 한 명의 유저가 많은 트윗을 가질 수 있고 그 트윗은 한 명의 유저와 연결되게 됨.

const tweetSchema = new Schema({
  text: String,
  likes: Number,
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const User = new mongoose.model("User", userSchema);
const Tweet = new mongoose.model("Tweet", tweetSchema);

// const makeTweets = async () => {
//   // const user = new User({ username: "진원", age: 29 }); 방법1
//   const user = await User.findOne({ username: "진원" });
//   const tweet1 = new Tweet({ text: "내년이면 30이라니", likes: 0 });
//   const tweet2 = new Tweet({ text: "말이 되냐 ㄹㅇ", likes: 9999 });
//   tweet2.user = user;
//   tweet2.save();
// };

// makeTweets();

const findTweet = async () => {
  // const t = await Tweet.findOne({}).populate("user"); // 이 값은 model명이 아니라 tweetSchema의 user임.
  const t = await Tweet.find({}).populate("user"); // user의 다른 정보 말고 username만 출력하고 싶을 때. id는 기본으로 나오는 것 같다.
  console.log(t);
};

findTweet();
