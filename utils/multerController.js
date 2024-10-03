const ApiError = require("./ApiError");
const multer = require("multer");
const multerStorage = multer.memoryStorage();

//multer will only accepts image
//using mimetype image/imageExtension
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new ApiError("Not an image, please upload only Images", 400), false);
};

const uploadUserImageConfiguration = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Set the limit to 10MB
});

const uploadPostImageConfiguration = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadUserImage = uploadUserImageConfiguration.single("media");
const uploadPostImage = uploadPostImageConfiguration.single("media");

module.exports = {
  uploadUserImage,
  uploadPostImage,
};
