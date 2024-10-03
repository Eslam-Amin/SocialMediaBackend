const mongoose = require("mongoose");

const followersModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "please provide post user"],
    },
    follower: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "please provide user to be followed"],
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

followersModel.pre(/^find/, function (next) {
  // this.populate({
  //     path: "user",
  //     select: "name _id username profilePicture"
  // })
  this.populate({
    path: "follower",
    select: "name _id username profilePicture gender",
  });
  next();
});
//     next();
// })

module.exports = mongoose.model("Followers", followersModel);
