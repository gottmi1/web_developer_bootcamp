const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});
// 자격증명을 지정함
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "YELPCAMP",
    allowedFromats: ["jpeg", "png", "jpg"],
  },
});
// 일반 저장소에 새 인스턴스를 만들고 업로드 된 파일을 로컬저장소에 저장하지않고 multer로 전달함
// 결국 클라우디네리의 내 계정 -> YELPCAMP폴더가 만들어지고 그곳에 이미지가 저장된다.

module.exports = {
  cloudinary,
  storage,
};
