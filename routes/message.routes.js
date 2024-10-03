const router = require("express").Router();
const Message = require("../models/messageModel");
const authController = require("../controllers/authController");
const messageController = require("../controllers/message.controller");

router.use(authController.protect);

router.route("/").post(messageController.createNewMessage);

router.route("/:id").get(messageController.getConversationMessages);
module.exports = router;
