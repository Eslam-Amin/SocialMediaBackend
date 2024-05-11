const router = require("express").Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController")

const catchAsync = require("./../utils/catchAsync");

router.route("/")
    .get(authController.protect,
        catchAsync(userController.getUser))

router.route("/authenticate-user")
    .get(catchAsync(userController.authenticateUser))

router.route("/top-5-users")
    .get(authController.protect,
        catchAsync(userController.topUsers))

router.route("/:id")
    .put(authController.protect,
        catchAsync(userController.updateUser))
    .delete(authController.protect,
        catchAsync(userController.deleteUser))

router.put("/updateDesc/:id",
    authController.protect,
    userController.updateUserDesc);

router.get("/search",
    catchAsync(userController.searchUser))

router.get("/postLikes",
    catchAsync(userController.getPostLikes))

// router.get("/", userController.getAllUsers)

//get user's friend 
router.get("/friends/:userId",
    authController.protect,
    catchAsync(userController.getUserFriends))

//follow a user
router.put("/:id/follow",
    authController.protect,
    catchAsync(userController.followUser))

//unfollow a user
router.put("/:id/unfollow",
    catchAsync(userController.unfollowUser))




module.exports = router;