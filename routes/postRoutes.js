const router = require("express").Router();

const postController = require("./../controllers/postController");
const authController = require("./../controllers/authController");
const fileController = require("./../controllers/firebase.controller");
const multerController = require("../utils/multerController")
const commentsRouter = require("./commentsRoutes")
const catchAsync = require("./../utils/catchAsync")

router.use(authController.protect)

router.route("/")
    .get(
        catchAsync(postController.getAllPosts)
    )
    .post(
        multerController.uploadPostImage,
        catchAsync(postController.resizePostPhoto),
        fileController.firebaseUpload("Posts"),
        catchAsync(postController.createPost)
    )

//get timeline posts
router.get("/timeline",
    catchAsync(postController.getTimelinePosts)
);
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
router.post("/:id/react",
    catchAsync(postController.postReaction)
)

//get user's all posts
router.get("/profile/:username",
    catchAsync(postController.getProfilePosts)
);

//get post's Likes  
router.get("/post-likes/:postId",
    catchAsync(postController.getPostLikes)
)

router.use('/:postId/comments', commentsRouter)


module.exports = router;