const bcrypt = require("bcrypt");
const User = require("../models/userModel")
const Followers = require("../models/followersModel")
const AppError = require("./../utils/appError")
const jwt = require("jsonwebtoken")
const sharp = require("sharp")

const getAllUsers = async (req, res) => {
    const users = await User.find({}, { password: 0, updatedAt: 0 }).sort({ city: -1 });
    let userMap = [];

    users.map((user) => {
        userMap.push(user)
    })
    res.status(200).json(userMap);
};


const uploadProfilePicture = async (req, res) => {
    let img = req.file.filename;
    req.body.profilePicture = "person/" + req.file.filename
    console.log(req.body.profilePicture)
    const user = await User.findByIdAndUpdate(req.user._id, { $set: { ...req.body } }, {
        new: true
    }).select("name username profilePicture _id gender");
    res.status(200).json({
        status: "success",
        user
    })

}

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

    let users = await Followers.aggregate([
        {
            $group: {
                _id: "$user",
                totalFollowers: { $sum: 1 }
            }
        },
        {
            $match: {
                _id: { $ne: (req.user._id) }
            }
        },

        {
            $sort: { totalFollowers: -1 }
        },
        {
            $limit: 5
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "userDetails"
            }
        },
        {
            $unwind: "$userDetails"
        },
        {
            $project: {
                _id: "$userDetails._id",
                name: "$userDetails.name",
                username: "$userDetails.username",
                totalFollowers: 1,
                profilePicture: "$userDetails.profilePicture",
                gender: "$userDetails.gender",
                isAdmin: "$userDetails.isAdmin"
            }
        }
    ]);

    res.status(200).json({
        status: "sucess",
        users
    })
}

const authenticateUser = async (req, res, next) => {
    // const token = req.headers.authorization.split(" ")[1];

    res.status(200).json({
        status: "success",
        user: req.user
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
    if (req.user._id.toString() === req.params.id.toString() || req.body.isAdmin) {
        const user = await User.findById(req.body.userId).select("+password");
        if (req.file)
            req.body.profilePicture = req.file.filename;
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

const getUserFollowers = async (req, res, next) => {
    const user = await User.findById(req.params.userId);
    if (!user)
        return next(new AppError("User Not Found", 404))
    let followers = await Followers.find({ user: req.params.userId }).select("follower -_id");
    followers = followers.map((follower) => follower.follower)
    res.status(200).json({
        status: "success",
        result: followers.length,
        followers
    });

};


const userInteraction = async (req, res, next) => {

    if (req.user._id !== req.params.id) {
        const user = await User.findById(req.params.id);

        if (!user)
            return next(new AppError("User Not Found!", 404))
        const isFollower = await Followers.findOne({ user: req.params.id, follower: req.user._id })
        let follower;
        if (!isFollower) {
            follower = await Followers.create({ user: req.params.id, follower: req.user._id });
            res.status(200).json({
                status: "success",
                message: "user has been followed"
            })
        }
        else {
            await Followers.findOneAndDelete({ user: req.params.id, follower: req.user._id })
            res.status(204).json({
                status: "success",
                message: null
            })
        }


    } else {
        return next(new AppError("you can't follow yourself!", 403))
    }
};


const getAllFollowers = async (req, res, next) => {
    const followers = await Followers.find();
    res.status(200).json({
        status: "success",
        followers
    })
}



const unfollowUser = async (req, res) => {
    req.body.userId = req.user._id
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

const resizeUserPhoto = async (req, res, next) => {
    if (!req.file)
        return next();
    req.file.filename = `${Date.now()}_user-${req.user.username}.jpeg`;
    sharp(req.file.buffer)
        .resize(500, 500, {
            fit: 'cover',
        })
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/images/person/${req.file.filename}`)
    return next();
}

module.exports = {
    getUser, getAllUsers,
    topUsers, deleteMe,
    searchUser, updateUser,
    updateUserDesc, deleteUser,
    getUserFollowers, resizeUserPhoto,
    authenticateUser, uploadProfilePicture,
    userInteraction, getAllFollowers

};