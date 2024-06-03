const mongoose = require("mongoose");


const commentsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: [true, "a comment must belong to a user"]
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: "Post",
        required: [true, "a comment must belong to a post"]
    },
    comment: {
        type: String,
        required: [true, "a comment must have a value"]
    }
},
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        },
        timestamps: true
    });



module.exports = mongoose.model("Comments", commentsSchema);