const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

CampgroundSchema.post("findOneAndDelete", async function (doc) {
  // CampgourndSchema의 post요청 중 findOneAndDelete가 있다면 다음 함수를 실행.. findByIdAndDelete만 findOneAndDelete 미들웨러를 호출할 수 있다.
  if (doc) {
    // 하나만 삭제하는 게 아니라 전체를 삭제하기 때문에 findById.. 가 아니라 제너릭형태인 remove를 사용한다
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
