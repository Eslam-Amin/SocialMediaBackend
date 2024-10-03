const express = require("express");

const commentsController = require("./../controllers/commentsController");
const authController = require("./../controllers/authController");

const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route("/").get(commentsController.getPostComments);
router.route("/").post(commentsController.createComment);
router
  .route("/:commentId")
  .patch(commentsController.editComment)
  .delete(commentsController.deleteComment);

module.exports = router;
