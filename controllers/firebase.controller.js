const dotenv = require("dotenv");
dotenv.config();

const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("../utils/catchAsync");
require("../utils/firebase");


const {
    getStorage,
    ref,
    getDownloadURL,
    uploadBytesResumable,
    deleteObject,
} = require("firebase/storage");


const storage = getStorage();

let folderName;



exports.firebaseUpload = (modelName) =>
    asyncHandler(async (req, res, next) => {

        if (req.file) {
            folderName = modelName
            try {
                const image = req.file
                req.body.url = await uploadImageAndGetUrl(image);
                next();
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    error: error.message,
                });
            }
        }
        else
            next()
    });


const uploadImageAndGetUrl = async (image) => {
    // Downgrade image quality
    // Upload image
    const storageRef = ref(
        storage,
        `${folderName}/${`image-${uuidv4()}-${Date.now()}-${folderName.toLowerCase()}.jpeg`}`
    );
    const metadata = { contentType: "image/jpeg" };
    // Add image download URL to request body
    const snapshot = await uploadBytesResumable(
        storageRef,
        image.buffer,
        metadata
    );
    return await getDownloadURL(snapshot.ref);
};

exports.firebaseDelete = async (fileUrl) => {
    try {
        const fullPath = new URL(fileUrl).pathname;
        const startIndex = fullPath.indexOf("image-");
        const fileName = fullPath.substring(startIndex);
        const storageRef = ref(storage, `${folderName}/${fileName}`);
        await deleteObject(storageRef);
        return true;
    } catch (error) {
        return false;
    }
};
