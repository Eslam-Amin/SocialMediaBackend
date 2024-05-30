const router = require("express").Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController")
const multerController = require("../utils/multerController")
const catchAsync = require("./../utils/catchAsync");
router.use(authController.protect)
router.route("/")
    .get(
        catchAsync(userController.getUser)
    )

router.route("/authenticate-user")
    .get(catchAsync(userController.authenticateUser)
    )
router.put("/upload/profilePicture",
    multerController.uploadUserImage,
    catchAsync(userController.uploadProfilePicture)
)

router.route("/top-5-users")
    .get(
        catchAsync(userController.topUsers)
    )

router.route("/delete-me")
    .delete(
        catchAsync(userController.deleteMe)
    )

router.route("/:id")
    .put(
        multerController.uploadUserImage,
        catchAsync(userController.updateUser))
    .delete(
        catchAsync(userController.deleteUser)
    )

router.put("/updateDesc/:id",
    userController.updateUserDesc);

router.get("/search",
    catchAsync(userController.searchUser)
)

router.get("/postLikes",
    catchAsync(userController.getPostLikes)
)


// router.get("/", userController.getAllUsers)

//get user's friend 
router.get("/friends/:userId",
    catchAsync(userController.getUserFriends)
)

//follow a user
router.put("/:id/follow",
    catchAsync(userController.followUser)
)
//unfollow a user
router.put("/:id/unfollow",
    catchAsync(userController.unfollowUser)
)




module.exports = router;