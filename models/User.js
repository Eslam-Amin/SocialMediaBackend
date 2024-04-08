const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 3,
        max: 20,
        unique: true,
    },
    name: {
        type: String,
        require: true,
        min: 3,
        max: 20,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        max: 50
    },
    password: {
        type: String,
        require: true,
        min: 6,
    },
    profilePicture: {
        type: String,
        default: "",
    },
    coverPicture: {
        type: String,
        default: "",
    },
    followers: {
        type: Array,
        default: []
    },
    followings: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    desc: {
        type: String,
        max: 100,
    },
    city: {
        type: String,
        max: 50
    },

    from: {
        type: String,
        max: 50
    },
    relationship: {
        type: Number,
        enum: [1, 2, 3, 4]
    },
    gender: {
        type: Number,
        enum: ["male", "female"]
    },
},
    { timestamps: true });



module.exports = mongoose.model("User", UserSchema);