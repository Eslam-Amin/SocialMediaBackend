const User = require("../models/userModel")
const Post = require("../models/postModel");
const AppError = require("../utils/appError");
const APIFeatures = require("../utils/apiFeatures")


const createPost = async (req, res) => {
    if (req.file) {
        req.body.img = req.file.filename;
        //post/1717104343480_post-Ecas.jpg
        req.body.img = `${req.body.img.split('-')[0].split('_')[1]}/${req.body.img}`
    }
    req.body.userId = req.user._id;
    const newPost = new Post(req.body);
    const post = await newPost.save();
    res.status(201).json({
        status: "success",
        post
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
    const post = await Post.findById(req.params.id).select("-__v -updatedAt");
    if (!post)
        return next(new AppError("The post not found", 404));
    res.status(200).json({
        status: "success",
        post
    });
};


const getTimelinePosts = async (req, res) => {
    const currentUser = await User.findById(req.params.userId);
    const users = [req.params.userId, ...currentUser.followings]
    const features = new APIFeatures(Post.find({ userId: { $in: users } }), req.query)
        .paginate()
        .sort()
    const posts = await features.query;
    //let posts = await Post.find({ userId: { $in: users } }).sort("-createdAt");
    // const friendPosts = await Promise.all(
    //     currentUser.followings.map(friendId => {
    //         return Post.find({ userId: friendId }).select("-__v -updatedAt");
    //     })
    // );
    // let posts = userPosts.concat(...friendPosts);

    res.status(200).json({
        status: "success",
        result: posts.length,
        posts
    });
};


const getUserPosts = async (req, res) => {
    const user = await User.findOne({ username: req.params.username });
    const features = new APIFeatures(Post.find({ userId: user._id }), req.query)
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
    if (post.userId === req.body.userId) {
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
        if (post.userId === req.body.userId) {
            await post.deleteOne({ $set: req.body });
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
    const post = await Post.findById(req.params.id);
    if (!post) return next(new AppError("post not found", 404))

    if (!post.likes.includes(req.body.userId)) {
        await post.updateOne({ $push: { likes: req.body.userId } });
        res.status(200).json({
            status: "success",
            message: "the Post Has been Liked"
        });
    } else {
        await post.updateOne({ $pull: { likes: req.body.userId } });
        res.status(200).json({
            status: "success",
            message: "the Post Has been disiked"
        });
    }
};


const getPostLikes = async (req, res, next) => {
    const post = await Post.findById(req.params.postId);
    if (!post) return next(new AppError("post not found", 404))

    const users = await Promise.all(
        post.likes.map(async userLikeId => {
            const userLikesId = await User.findById(userLikeId).select("_id username profilePicture gender name")
            return userLikesId;
        })
    )

    res.status(200).json({
        status: "success",
        result: users.length,
        users
    })

};



module.exports = {
    createPost, updatePost, deletePost,
    postReaction, getPost, getAllPosts,
    getTimelinePosts, getUserPosts, getPostLikes
}