const router = require("express").Router();

const postController = require("./../controllers/postController");
const authController = require("./../controllers/authController");
const multerController = require("../utils/multerController")

const catchAsync = require("./../utils/catchAsync")
router.use(authController.protect)
router.route("/")
    .get(
        catchAsync(postController.getAllPosts)
    )
    .post(
        multerController.uploadPostImage,
        catchAsync(postController.createPost)
    )
router.route("/:id")
    .get(
        catchAsync(postController.getPost)
    )
    .put(
        catchAsync(postController.updatePost)
    )
    .delete(
        catchAsync(postController.deletePost)
    )

//like/dislike a post
router.put("/:id/react",
    catchAsync(postController.postReaction)
)

//get timeline posts
router.get("/timeline/:userId",
    catchAsync(postController.getTimelinePosts)
);

//get user's all posts
router.get("/profile/:username",
    catchAsync(postController.getUserPosts)
);

//get post's Likes  
router.get("/post-likes/:postId",
    catchAsync(postController.getPostLikes)
)

module.exports = router;