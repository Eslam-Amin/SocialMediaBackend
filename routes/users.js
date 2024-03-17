const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User")

//update user
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            }
            catch (err) {
                return res.status(500).json(err);
            }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json("Account Has been Updated");
        }

        catch (err) {
            return res.status(500).json(err);

        }
    }
    else {
        return res.status(403).json("you can only update your account")
    }
})


//delete user
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account Has been deleted Successfully");
        }

        catch (err) {
            return res.status(404).json(err);

        }
    }
    else {
        return res.status(404).json("you can only delete your account")
    }
})



//get a user
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username });
        const { password, updatedAt, ...otherUserInfo } = user._doc
        res.status(200).json(otherUserInfo);
    }
    catch (err) {
        return res.status(404).json(err)
    }
})


router.get("/search", async (req, res) => {
    const username = req.query.username;
    const query = { name: new RegExp("^" + username, "i") }
    if (username) {
        console.log(username);
        try {
            const user = await User.find(query, { name: 1, username: 1, _id: 1, profilePicture: 1 });

            user.length !== 0 ? res.status(200).json(user) : res.status(404).json("User Not Found!");

        }
        catch (err) {
            res.status(500).json(err)
        }
    }

})


router.get("/", async (req, res) => {
    try {
        //let id = req.params.id;
        //const user = await User.findById(id);
        const users = await User.find({}, { password: 0, updatedAt: 0 }).sort({ city: -1 });
        let userMap = [];

        users.map((user) => {
            userMap.push(user)
        })

        res.status(200).json(userMap);
    }
    catch (err) {
        return res.status(404).json(err)
    }
})


//get user's friend 
router.get("/friends/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const friends = await Promise.all(
            user.followers.map(async friendId => {
                const userFollower = await User.findById(friendId)
                return userFollower;
            })
        )
        let friendsList = [];
        friends.map(friend => {
            const { _id, username, profilePicture, name } = friend;
            friendsList.push({ _id, username, profilePicture, name });
        })
        res.status(200).json(friendsList);
    } catch (err) {
        res.status.code ? res.status(500).json(err) : "";
    }
})


//follow a user
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if (!user.followers.includes(req.body.userId)) {

                await user.updateOne({ $push: { followers: req.body.userId } });
                user.followers.push(req.body.userId);



                await currentUser.updateOne({ $push: { followings: req.params.id } });
                currentUser.followings.push(req.params.id);

                res.status(200).json({ msg: "user Has Been Followed", updatedUser: currentUser });
            } else {
                res.status(403).json("you already follow this user")
            }


        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("you can't follow yourself")
    }
})



//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            if (user.followers.includes(req.body.userId)) {

                await user.updateOne({ $pull: { followers: req.body.userId } });
                const followers = user.followers.filter((u) => { return u !== req.body.userId });
                user.followers = followers;
                await currentUser.updateOne({ $pull: { followings: req.params.id } });
                const followings = currentUser.followings.filter((u) => { return u !== req.params.id });
                currentUser.followings = followings;
                res.status(200).json({ msg: "user Has Been Unfollowed", updatedUser: currentUser });
            } else {
                res.status(403).json("you already unfollow this user")
            }


        } catch (err) {
            res.status(500).json(err)
        }
    } else {
        res.status(403).json("you can't follow yourself")
    }
})




module.exports = router;