const AppError = require("./appError")
const multer = require("multer")

const multerStorage = (entity) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            //the first argument is err if not then it's null
            cb(null, `${publicFolder}/${entity}`)
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}_${entity}-${file.originalname}`)
        }
    });
}
const publicFolder = "public/images"

//multer will only accepts image 
//using mimetype image/imageExtension
const multerFilter = (req, file, cb) => {
    console.log("in multer Controller, ", file)
    if (file.mimetype.startsWith("image"))
        cb(null, true)
    else
        cb(new AppError("Not an image, please upload only Images", 400), false)
}


const uploadUserImageConfiguration = multer({
    storage: multerStorage("person"),
    fileFilter: multerFilter
})


const uploadPostImageConfiguration = multer({
    storage: multerStorage("posts"),
    fileFilter: multerFilter
})



const uploadUserImage = uploadUserImageConfiguration.single("profilePicture")
const uploadPostImage = uploadPostImageConfiguration.single("postImage")


module.exports = {
    uploadUserImage, uploadPostImage

}