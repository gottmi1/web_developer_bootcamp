const mongoose = require("mongoose");

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

const userSchema = new mongoose.Schema({
  first: String,
  last: String,
  addresses: [
    {
      _id: { id: false },
      street: String,
      city: String,
      state: String,
      country: String,
    },
  ],
});

const User = mongoose.model("User", userSchema);
const makeUser = async () => {
  const u = new User({
    first: "jinwon",
    last: "kim",
  });
  u.addresses.push({
    street: "산성동",
    city: "대전",
    state: "머전",
    country: "republic of korea",
  });
  const res = await u.save();
  console.log(res);
};
// 새로운 User를 만들고 저장한다

const addAddress = async (id) => {
  const user = await User.findById(id); // 데이터 주고받는 건 그냥 다 async await을 사용하는듯?
  user.addresses.push({
    street: "거리1",
    city: "도시1",
    state: "스테이트1",
    country: "republic of korea",
  });
  const res = await user.save();
  console.log(res);
};
// 기존 사용자의 id를 알면 이렇게 추가할 수 있다.

// makeUser();
addAddress("621121d098a42e5d7494c24d"); // 이 id는 위 u의 id임.
// 이렇게 하면 u는 두개의 addresses를 갖게 된다. 이 방법은 사용자가 가지는 값이 많지 않을 때 관계를 저장할 수 있는 최선의 방법이라고 한다.

// one to few
