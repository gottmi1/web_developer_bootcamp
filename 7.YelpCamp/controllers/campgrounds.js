const Campground = require("../models/Campground");
const { cloudinary } = require("../cloudinary/index");
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  console.log(campground);
  req.flash("success", "새로운 캠핑장이 생성되었습니다"); //플래시 생성
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: "author" })
    .populate("author");
  if (!campground) {
    req.flash("error", "캠핑장을 찾을 수 없습니다");
    res.redirect("/campgrounds");
    // 한 캠핑장을 북마크에 저장해놓고 삭제하거나 해서 주소가 사라졌을 경우, 에러를 띄우는 대신 campgrounds로 리다이렉트 해주며 error alert를 띄움.
  }
  res.render("campgrounds/show", { campground });
};
// 클릭한 해당 링크의 id를 받아옴

module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash("error", "캠핑장을 찾을 수 없습니다");
    return res.redirect("/campgrounds");
    // 한 캠핑장을 북마크에 저장해놓고 삭제하거나 해서 주소가 사라졌을 경우, 에러를 띄우는 대신 campgrounds로 리다이렉트 해주며 error alert를 띄움.
  }
  res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground, // 이 부분 중괄호로 감싸야 작동함
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    // 클라우디네리 저장소에서도 해당 이미지를 삭제해준다
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }
  // 삭제할 이미지가 있을 시, 선택한 이미지를 campground에서 제외하고 업데이트?
  req.flash("update", "캠핑장이 업데이트되었습니다."); //플래시 생성
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("del", "캠핑장이 삭제되었습니다."); //플래시 생성
  res.redirect("/campgrounds");
};
