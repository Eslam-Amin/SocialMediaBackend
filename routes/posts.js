const router = require("express").Router();
const User = require("../models/User")
const Post = require("../models/Post");

//create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(500).json(err)
    }
})


//update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("The Post Has Been Updated");

        }
        else {
            res.status(403).json("you Can Only Update your Own Post")
        }
    }

    catch (err) {
        res.status(500).json(err)
    }

})


//delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne({ $set: req.body });
            res.status(200).json("The Post Has Been deleted");

        }
        else {
            res.status(403).json("you Can Only delete your Own Post")
        }
    }

    catch (err) {
        res.status(500).json(err)
    }

})



//like/dislike a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("the Post Has been Liked");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("the Post Has been Disliked");
        }
    }
    catch (err) {
        res.status(500).json(err)
    }
})


//get a post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err)
    }
})


//get a post
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err)
    }
})




//get timeline posts
router.get("/timeline/:userId", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id }).sort({ createdAt: -1 });
        const friendPosts = await Promise.all(
            currentUser.followings.map(friendId => {
                return Post.find({ userId: friendId });
            })
        );
        res.status(200).json(userPosts.concat(...friendPosts));
    } catch (err) {
        res.status(500).json(err)
    }
})




//get user's all posts
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find({ userId: user._id }).sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err)
    }
})



router.get("/postLikes/:postId", async (req, res) => {
    try {

        const post = await Post.find({ _id: req.params.postId });
        //console.log(post)
        //res.status(200).json(post)
        //const users = [];
        console.log(post[0].likes)
        const users = await Promise.all(
            post[0].likes.map(async userLikeId => {
                const userLikesId = await User.findById(userLikeId)
                return userLikesId;
            })
        )
        let updatedPostLikes = [];
        users.map(postLike => {
            const { _id, username, profilePicture, name } = postLike;
            updatedPostLikes.push({ _id, username, profilePicture, name });
        })
        res.status(200).json(updatedPostLikes)
    }
    catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
})






module.exports = router;