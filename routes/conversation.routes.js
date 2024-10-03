const router = require("express").Router();
const conversationController = require("../controllers/conversation.controller");
const authController = require("../controllers/authController");

router.use(authController.protect);
//new conv
router.route("/").post(conversationController.createNewConversation);
router.route("/:id").get(conversationController.getUserConversations);
router.route("/:id").get(conversationController.getConversation);

module.exports = router;
