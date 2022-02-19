const joi = require("joi");
// joi는 mongoose 스키마가 아니라 자바스크립트 객체에서 사용하는 방법이며 해당 메서드를 사용하여 스키마파일을 정의할 수 있는 방법이다.

module.exports.campgroundSchema = joi.object({
  campground: joi
    .object({
      // 여기에 다양한 key값을 보낼 수 있음.
      title: joi.string().required(),
      location: joi.string().required(),
      image: joi.string().required(),
      price: joi.number().required().min(0),
      description: joi.string().required(),
    })
    .required(), // campground의 tilte,price,description등이 있다면 bodt는 campground를 반드시 포함해야하기 때문에 여기서 체크한다.
});
