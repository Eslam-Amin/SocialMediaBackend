const mongoose = require("mongoose");


const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "please provide post userid"]
    },
    content: {
        type: String,
        max: 500
    },
    img: {
        type: String,
        default: ""
    },
    likes: {
        type: Array,
        default: []
    },
    createdAt: Date
},
    {
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    },
    { timestamps: true });


postSchema.virtual("numOfLikes")
    .get(function () {
        return this.likes.length
    });


module.exports = mongoose.model("Post", postSchema);