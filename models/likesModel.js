const mongoose = require("mongoose");

const likesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
  { timestamps: true },
);

likesSchema.pre(/^find/, function (next) {
  next();
});

module.exports = mongoose.model("Likes", likesSchema);
