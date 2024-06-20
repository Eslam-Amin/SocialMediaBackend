const Message = require("../models/messageModel");
const Conversation = require("../models/conversationModel");
const AppError = require("../utils/appError")
const catchAsync = require("../utils/catchAsync")
const handlers = require("../utils/handlers")

exports.createNewMessage = catchAsync(async (req, res, next) => {
    const conversation = req.body.conversation;
    const receiver = req.body.receiver;
    const sender = req.user.id;
    const text = req.body.text;
    const existingConv = await Conversation.findById(conversation);

    let message;
    if (!existingConv) {
        const newConv = await Conversation.create({ members: [sender, receiver] })
        message = await Message.create({ conversation: newConv._id, sender, text })
    } else {
        message = await Message.create({ conversation, sender, text });
    }
    message = await message.populate({
        path: "sender",
        select: "name _id gender profilePicture username isAdmin"
    })
    existingConv.updatedAt = Date.now()
    await existingConv.save();
    res.status(201).json({
        status: true,
        message
    })

})

exports.getConversationMessages = catchAsync(async (req, res, next) => {
    const conversation = req.params.id;
    const messages = await Message.find({ conversation }).populate({
        path: "sender",
        select: "name _id gender profilePicture username isAdmin"
    });
    // if (!messages || messages.length === 0) return next(new AppError("There is no messages with this conversation ", 404))

    res.status(200).json({
        success: true,
        messages
    })
})
