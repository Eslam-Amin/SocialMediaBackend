const Comments = require("../models/commentsModel");
const User = require("../models/userModel")
const Post = require("../models/postModel");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures")
const catchAsync = require("../utils/catchAsync");
const userModel = require("../models/userModel");

const createComment = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.postId);
    if (!post)
        return next(new AppError("Post Not Found", 404))
    const comment = await Comments.create({ user: req.user._id, post: req.params.postId, comment: req.body.comment });
    post.numOfComments += 1;
    await post.save();
    res.status(201).json({
        status: "succes",
        comment,
        numOfComments: post.numOfComments
    })
})

const getPostComments = catchAsync(async (req, res) => {
    const comments = await Comments.find({ post: req.params.postId }).select("user comment createdAt").populate({
        path: "user",
        select: "username gender name _id profilePicture isAdmin"
    })
    res.status(200).json({
        status: "success",
        result: comments.length,
        comments
    })
})

const editComment = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.postId);
    if (!post)
        return next(new AppError("Post Not Found", 404))
    const comment = await Comments.findById(req.params.commentId)

    if (!comment)
        return next(new AppError("comment not found!", 404))
    if (comment.user.toString() === req.user._id.toString()) {
        comment.comment = req.body.comment;
        await comment.save();
    }
    else
        return res.status(403).json({
            status: "fail",
            message: "you're only allowed to edit your own comments"
        })
    res.status(201).json({
        status: "success",
        comment
    })
})

const deleteComment = catchAsync(async (req, res, next) => {
    // await userModel.updateMany({}, { $set: { "passwordResetExpiresAt": Date.now() } });
    // await userModel.updateMany({}, { $set: { "passwordResetToken": "" } });
    // await userModel.updateMany({}, { $set: { "passwordResetExpiresAt": Date.now() } });
    const post = await Post.findById(req.params.postId);
    if (!post)
        return next(new AppError("Post Not Found", 404))
    const comment = await Comments.findByIdAndDelete(req.params.commentId)
    if (!comment)
        return next(new AppError("comment not found!", 404))
    if (comment.user.toString() === req.user._id.toString()) {

        post.numOfComments -= 1;
        await post.save();
        res.status(204).json({
            statsu: "success",
            data: null
        })
    }
    else
        return res.status(403).json({
            status: "fail",
            message: "you're only allowed to delete your own comments"
        })

})
module.exports = {
    createComment, getPostComments,
    editComment, deleteComment
}