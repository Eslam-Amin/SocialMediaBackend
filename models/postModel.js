const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "please provide post user"],
    },
    content: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
      default: "",
    },
    // numOfLikes: {
    //     type: Number,
    //     default: 0
    // },
    // numOfComments: {
    //     type: Number,
    //     default: 0
    // }
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

postSchema.virtual("numOfLikes").get(function () {
  return this.likes?.length || 0;
});

postSchema.virtual("numOfComments").get(function () {
  return this.comments?.length || 0;
});

postSchema.pre(/^find/, function (next) {
  // this.populate({
  //     path: "user",
  //     select: "name username _id profilePicture gender"
  // }).populate("likes")
  next();
});

//virtual Populate
postSchema.virtual("likes", {
  ref: "Likes",
  foreignField: "post",
  localField: "_id",
});
postSchema.virtual("comments", {
  ref: "Comments",
  foreignField: "post",
  localField: "_id",
});

module.exports = mongoose.model("Post", postSchema);
