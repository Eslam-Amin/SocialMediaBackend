const User = require("../models/userModel")
const Post = require("../models/postModel");
const Likes = require("../models/likesModel");
const Comments = require("../models/commentsModel");
const Followers = require("../models/followersModel");
const fileController = require("./../controllers/firebase.controller");

const ApiError = require("../utils/ApiError");
const APIFeatures = require("../utils/ApiFeatures")
const sharp = require("sharp")


const createPost = async (req, res) => {
    if (req.file) {
        req.body.img = req.body.url;
    }
    req.body.user = req.user._id;
    const newPost = new Post(req.body);
    const post = await newPost.save();
    post.user = req.user

    res.status(201).json({
        status: "success",
        post,

    });

};


const getAllPosts = async (req, res) => {
    const features = new APIFeatures(Post.find(), req.query)
        .paginate();
    const posts = await features.query;
    res.status(200).json({
        status: "success",
        result: posts.length,
        posts
    });
};

const getPost = async (req, res, next) => {
    const post = await Post.findById(req.params.id).select("-__v -updatedAt")
    if (!post)
        return next(new ApiError("The post not found", 404));
    res.status(200).json({
        status: "success",
        post
    });
};


const getTimelinePosts = async (req, res, next) => {
    // const currentUser = await User.findById(req.params.id);
    // const followers = await Followers.find({ follower: req.params.id })
    console.log(req.sessionID)

    const followers = await Followers.find({ follower: req.user.id }).select("user -_id")
    const users = [req.user._id, ...followers.map((follower) => follower.user)]

    const features = new APIFeatures(Post.find({ user: { $in: users } })
        .populate({
            path: "user",
            select: "name username _id profilePicture gender isAdmin"
        })
        .populate({
            path: "likes",
            select: "user -post -_id"
        })
        .populate({
            path: "comments",
            select: "comment -post -_id"
        })
        , req.query)
        .paginate()
        .sort()
    const posts = await features.query;

    if (posts.length === 0)
        return res.status(200).json({
            status: "success",
            message: "There are no posts to be shown"
        })

    res.status(200).json({
        status: "success",
        result: posts.length,
        posts,
    });
};


const getProfilePosts = async (req, res) => {
    const user = await User.findOne({ username: req.params.username });

    const features = new APIFeatures(Post.find({ user: user._id })
        .populate({
            path: "user",
            select: "name username _id profilePicture gender isAdmin"
        }).populate({
            path: "likes",
            select: "user -post -_id"
        }).populate({
            path: "comments",
            select: "comment -post -_id"
        })
        , req.query)
        .paginate()
        .sort()
    const posts = await features.query;
    // const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 });
    res.status(200).json({
        status: "success",
        result: posts.length,
        posts
    });
};


const updatePost = async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (post.user.toString() === req.user._id.toString()) {
        await post.updateOne({ $set: req.body });
        res.status(200).json({
            stats: "success",
            message: "The Post Has Been Updated"
        });
    }
    else {
        res.status(403).json({
            stats: "fail",
            message: "you can only update your own Post"
        });
    }


};

const deletePost = async (req, res) => {
    const post = await Post.findById(req.params.id);

    if (post) {
        if (post.user.toString() === req.user._id.toString()) {
            await fileController.firebaseDelete(post.img)
            await post.deleteOne({ $set: req.body });
            await Comments.deleteMany({ post: req.params.id })
            await Likes.deleteMany({ post: req.params.id })
            res.status(204).json({
                status: "success",
            })
        }
        else {
            res.status(403).json({
                status: "fail",
                message: "you can only delete your own post"
            })
        }
    }
    else {
        res.status(400).json({
            status: "fail",
            message: "the Post was Deleted deleted before"
        })
    }

};

const postReaction = async (req, res, next) => {
    const post = await Post.findById(req.params.id)
    if (!post)
        return next(new ApiError("Post Not Found", 404))

    let likes = await Likes.findOne({ post: req.params.id, user: req.user._id })
    if (!likes) {
        post.numOfLikes = post.numOfLikes + 1;
        likes = await Likes.create({ user: req.user._id, post: req.params.id })
        await post.save()
        res.status(201).json({
            status: "success",
            message: "the Post Has been Liked"
        })
    }
    else {
        await Likes.findByIdAndDelete(likes._id)
        post.numOfLikes = post.numOfLikes - 1;
        await post.save()
        res.status(204).json({
            status: "success",
            data: null
        })
    }
};


const getPostLikes = async (req, res, next) => {
    const post = await Post.findById(req.params.postId);
    if (!post) return next(new ApiError("post not found", 404))

    let likes = await Likes.find({ post: req.params.postId }).select("user -_id").populate({
        path: "user",
        select: "name username profilePicture _id gender isAdmin"
    });
    likes = likes.map((like) => like.user)

    res.status(200).json({
        status: "success",
        result: likes.length,
        likes
    })

};


const resizePostPhoto = async (req, res, next) => {
    if (!req.file)
        return next();
    req.file.filename = `${Date.now()}-post-${req.user.username}.jpeg`;
    sharp(req.file.buffer)
        .resize(500, 500, {
            fit: 'inside',
            withoutEnlargement: true
        })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
    // .toFile(`public/images/posts/${req.file.filename}`)
    return next();
}


module.exports = {
    createPost, updatePost, deletePost,
    postReaction, getPost, getAllPosts,
    getTimelinePosts, getProfilePosts, getPostLikes,
    resizePostPhoto
}