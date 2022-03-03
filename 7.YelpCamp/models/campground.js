const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// https://res.cloudinary.com/dsdaeefdde/image/upload/w_200/v1646276887/YELPCAMP/zl7o7jhfltkuan2i1ism.png

const ImageSchema = new Schema({
  url: String,
  filename: String,
});
ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});
// 가상 속성 추가 기존 이미지를 썸네일 크기로 바꾸기 위해 사용했다.
const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
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
