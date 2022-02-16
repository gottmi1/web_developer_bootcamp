const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers"); // places와 descriptors는 배열임
const Campground = require("../models/Campground");

main()
  .then(() => {
    console.log("localhost:27017 database conneted");
  })
  .catch((err) => {
    console.log("localhost:27017 NO CONNECT");
    console.log(err);
  });

async function main() {
  await mongoose.connect("mongodb://localhost:27017/Yelp-camp");
}

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  // 이 파일을 node할 때 마다 전에 있던 데이터베이스는 비워준다
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random1000].city} , ${cities[random1000].state}`,
      title: `${sample(descriptors)}, ${sample(places)}`, // sample은 함수임. 단순히 배열을 인자로 받아서 랜덤으로 던져주는 일을 함
    });
    await camp.save();
  }
};

// seedDB(); 이렇게 하면 계속 연결된 상태로 있는다

seedDB().then(() => {
  mongoose.connection.close();
});
// 이렇게 하면 실행하자 마자 끊김
