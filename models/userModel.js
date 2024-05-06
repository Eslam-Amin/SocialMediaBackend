const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const crypto = require("crypto")


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        min: 3,
        max: 20,
        unique: true,
    },
    name: {
        type: String,
        required: [true, "name is required"],
        min: 3,
        max: 20,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        max: 50,
        lowercase: true,
        select: false
    },
    password: {
        type: String,
        required: [true, "password is required"],
        min: 6,
        select: false
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
        default: false,
    },
    desc: {
        type: String,
        max: 100,
    },
    city: {
        type: String,
        required: [true, "city is required"],
        max: 50
    },

    from: {
        type: String,
        required: [true, "from is required"],
        max: 50
    },
    relationship: {
        type: String,
        // enum: [1, 2, 3, 4],
        enum: ["single", "engaged", "married", "other"],
        required: [true, "relationship is required"],
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: [true, "gender is required"],
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now()
    },
    passwordResetExpiresAt: Date,
    passwordResetToken: String,
    active: {
        type: Boolean,
        default: true,
        select: false
    }
},
    { timestamps: true });

//runs on changing the password
userSchema.pre("save", function (next) {
    if (!this.isModified("password") || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    //hashing Password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    //this.password = await bcrypt.hash(this.password, 12);
    next();
})

//used in login
userSchema.methods.validPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
}

//checks if password has changed after the token was issued
userSchema.methods.isPasswordChanged = function (JwtTimestamp) {
    if (!this.passwordChangedAt)
        //password didn't change
        return false
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10)
    return JwtTimestamp < changedTimestamp

}


userSchema.methods.createPasswordResetToken = function (next) {
    const resetToken = crypto.randomBytes(32).toString("hex")

    this.passwordResetToken = crypto.createHash("sha256")
        .update(resetToken)
        .digest("hex")

    this.passwordResetExpiresAt = Date.now() + 10 * 60 * 1000;
    return resetToken;
}


userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } })
    next()
})

module.exports = mongoose.model("User", userSchema);