const router = require("express").Router();

const postController = require("./../controllers/postController");
const authController = require("./../controllers/authController");

const catchAsync = require("./../utils/catchAsync")

router.route("/")
    .get(authController.protect,
        catchAsync(postController.getAllPosts))
    .post(
        authController.protect,
        catchAsync(postController.createPost))

router.route("/:id")
    .get(authController.protect,
        catchAsync(postController.getPost))
    .put(authController.protect,
        catchAsync(postController.updatePost))
    .delete(authController.protect,
        catchAsync(postController.deletePost))

//like/dislike a post
router.put("/:id/react",
    authController.protect,
    catchAsync(postController.postReaction))

//get timeline posts
router.get("/timeline/:userId",
    authController.protect,
    catchAsync(postController.getTimelinePosts));

//get user's all posts
router.get("/profile/:username",
    authController.protect,
    catchAsync(postController.getUserPosts));

//get post's Likes  
router.get("/post-likes/:postId",
    catchAsync(postController.getPostLikes))

module.exports = router;