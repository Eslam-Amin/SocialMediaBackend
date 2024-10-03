const Conversation = require("../models/conversationModel");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const handlers = require("../utils/handlers");

exports.createNewConversation = catchAsync(async (req, res, next) => {
  const receiver = req.body.receiver;
  const sender = req.user.id;
  const existingConv = await Conversation.find({
    members: { $all: [sender, receiver] },
  });
  console.log(existingConv);
  if (existingConv.length !== 0)
    return next(new ApiError(`There is a Conversation created before`, 400));
  let conversation = await Conversation.create({
    members: [sender, receiver],
  });
  conversation = await conversation.populate({
    path: "members",
    select: "name _id gender profilePicture username isAdmin",
  });
  res.status(201).json({
    success: true,
    conversation,
  });
});

exports.getConversation = catchAsync(async (req, res, next) => {
  const conversation = await Conversation.findById(req.params.id).populate({
    path: "members",
    select: "name _id gender profilePicture username isAdmin",
  });

  handlers.checkForNull(conversation, "conversation", next);
  res.status(200).json({
    status: true,
    conversation,
  });
});

exports.getUserConversations = catchAsync(async (req, res, next) => {
  const conversations = await Conversation.find({
    members: { $in: [req.params.id] },
  })
    .sort({ updatedAt: -1 })
    .populate({
      path: "members",
      select: "name _id gender profilePicture username isAdmin",
    });
  handlers.checkForNull(conversations, "conversation", next);
  res.status(200).json({
    status: true,
    conversations,
  });
});
