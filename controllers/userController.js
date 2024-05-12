const bcrypt = require("bcrypt");
const User = require("../models/userModel")
const AppError = require("./../utils/appError")
const jwt = require("jsonwebtoken")

const getAllUsers = async (req, res) => {
    const users = await User.find({}, { password: 0, updatedAt: 0 }).sort({ city: -1 });
    let userMap = [];

    users.map((user) => {
        userMap.push(user)
    })
    res.status(200).json(userMap);
};

const getUser = async (req, res, next) => {

    const userId = req.query.userId;
    const username = req.query.username;
    const user = userId
        ? await User.findById(userId).select("-password -updatedAt -createdAt -passwordChangedAt ")
        : await User.findOne({ username }).select("-password -updatedAt -createdAt -passwordChangedAt ");
    if (!user)
        return next(new AppError(`No User Found with That username or id`, 404))

    res.status(200).json({
        status: "success",
        user
    });

};

const topUsers = async (req, res, next) => {
    const users = await User.aggregate([
        {
            $unwind: "$followers",
        },
        {
            $group: {
                _id: "$_id",
                size: {
                    $sum: 1,
                },
            },
        },
        {
            $sort: {
                size: -1,
            },
        },
        {
            $limit: 5,
        },
    ]);
    const top = users.map((user) => user._id);

    const topOnes = await User.find({ _id: { $in: top } })
        .select("_id username gender name profilePicture isAdmin")

    res.status(200).json({
        status: "sucess",
        users:
            topOnes
    })
}

const authenticateUser = async (req, res, next) => {
    // const token = req.headers.authorization.split(" ")[1];
    let token = "";
    if (req.headers.authorization
        && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token)
        return next(new AppError(
            "You're not Logged in! Please Log in to get Access", 401
        ));

    const decoded = jwt.verify(token, process.env.JWT_SEC);
    const user = await User.findById(decoded.id).select("-password -passwordChangedAt -createdAt -updatedAt -__v");
    if (!user)
        return next(new AppError(`No User Found with That username or id`, 404))

    res.status(200).json({
        status: "success",
        user
    });

};


const searchUser = async (req, res) => {
    const username = req.query.username;
    const query = { name: new RegExp("^" + username, "i") }
    if (username) {
        const user = await User.find(query).select("name profilePicture gender username _id")

        user.length !== 0 ? res.status(200).json(user) : res.status(404).json("User Not Found!");
    }
};


const updateUser = async (req, res, next) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        const user = await User.findById(req.body.userId).select("+password");
        if (req.body.password) {
            const validPassword = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) {
                return next(new AppError("Invalid Password!!", 400));
            }
            delete req.body.password
            const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: { ...req.body } }, {
                new: true,
                runValidators: true
            }).select("-__v -password -passwordChangedAt -createdAt");

            return res.status(200).json({ msg: "Account Has been Updated", updatedUser });
        } else {
            res.status(500).json("Something Went Wrong, Please Try Again Later")
        }

    }
    else {
        return res.status(403).json("you can only update your account")
    }
};

const updateUserDesc = async (req, res) => {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body },
        { new: true, runValidators: true }).select("-__v -password -passwordChangedAt -createdAt");
    // const { pasword, updatedAt, ...otherUserInfo } = updatedUser._doc;
    res.status(200).json({ msg: "Description Has been Updated", updatedUser });
};

const deleteUser = async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account Has been deleted Successfully");
    }
    else {
        return res.status(404).json("you can only delete your account")
    }
};

const deleteMe = async (req, res) => {

    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
        status: "success",
        data: null
    });
}

const getUserFriends = async (req, res) => {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
        user.followers.map(async friendId => {
            const userFollower = await User.findById(friendId)
            return userFollower;
        })
    )
    let friendsList = [];
    friends.map(friend => {
        const { _id, username, profilePicture, name, gender } = friend;
        friendsList.push({ _id, username, profilePicture, name, gender });
    })
    res.status(200).json({
        status: "success",
        friendsList
    });

};


const followUser = async (req, res) => {
    if (req.body.userId !== req.params.id) {
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


    } else {
        res.status(403).json("you can't follow yourself")
    }
};


const unfollowUser = async (req, res) => {
    if (req.body.userId !== req.params.id) {
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
    } else {
        res.status(403).json("you can't follow yourself")
    }
};

const getPostLikes = async (req, res) => {
    const userId = req.query.userId;
    if (userId) {
        const user = await User.findById({ _id: userId }, { name: 1, username: 1, _id: 1, profilePicture: 1 });

        user.length !== 0 ? res.status(200).json(user) : res.status(404).json("User Not Found!");
    }

};


module.exports = {
    getUser, getAllUsers,
    topUsers, deleteMe,
    searchUser, updateUser,
    updateUserDesc, deleteUser,
    getUserFriends, followUser,
    unfollowUser, getPostLikes,
    authenticateUser,

};