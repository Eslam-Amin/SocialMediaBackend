const crypto = require("crypto")
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const AppError = require("./../utils/appError")
const catchAsync = require("./../utils/catchAsync");
const generateHTML = require("./../utils/generateHTML")
const { sendEmail, sendEmailGoogle } = require("./../utils/email")

const signToken = id => {
    return jwt.sign({
        id
    },
        process.env.JWT_SEC,
        {
            expiresIn: process.env.JWT_EXPIRES_IN
        }

    )
}

const createSendToken = (user, statusCode, res, req) => {
    const expiryDate = new Date(Date.now() +
        process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000);
    const cookieOptions = {
        expires: expiryDate,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    }

    const token = signToken(user._id);
    // req.headers["Authorization"] = `Bearer ${token}`
    res.setHeader('Authorization', `Bearer ${token}`)

    res.cookie("token", token, cookieOptions)
    res.status(statusCode).json({
        status: "success",
        user
    })
}

const clearCookie = (req, res, next) => {
    return res.cookie("token", "loggedOut", {
        expires: new Date(Date.now() -
            process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000)
    })
        .json({
            status: "success",
            message: "cookies are cleared"
        })
}

const clearAllCookies = (req, res, next) => {
    for (let cookieName in req.cookies) {
        res.cookie(cookieName, '', { expires: new Date(0) });
    }
    res.send("all Cookies Has been Deleted")

}

const getCookies = (req, res, next) => {
    let cookies;
    for (let cookieName in req.cookies) {
        cookies.push(req.cookies[cookieName]);
    }
    console.log(res.cookies)
    console.log(req.cookies)
    res.send("All Cookies " + cookies)

}

const register = catchAsync(async (req, res) => {

    //create new user
    const newUser = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        relationship: req.body.relationship,
        city: req.body.city,
        from: req.body.from,
        desc: req.body.desc,
        gender: req.body.gender,
        passwordChangedAt: req.body.passwordChangedAt,

    });
    //save user and return respond
    const user = await newUser.save();
    user.password = undefined;

    createSendToken(user, 201, res, req)

})

const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return next(new AppError("please Provide email or password", 401))

    const user = await User.findOne({ email }).select("+password -passwordChangedAt");

    if (!user || !await user.validPassword(password, user.password))
        return next(new AppError("Either mail or password is INVALID", 401))
    req.headers.authorization = "Bearer " + signToken(user._id);
    user.password = undefined
    createSendToken(user, 200, res, req)

})


const protect = catchAsync(async (req, res, next) => {
    //let token = null;
    console.log("🚀---- Cookie in protect -----🚀")
    console.log(req.cookies)
    // console.log(req.headers.Authorization)
    console.log("🚀---- Cookie in protect -----🚀")
    let token = false;
    if (req.cookies["token"])
        token = req.cookies["token"]
    else if (!token || token == "null")
        return next(new AppError("you're not logged In, Please Login to get access, Specify Cookie", 401))

    const decoded = jwt.verify(token, process.env.JWT_SEC)
    const currentUser = await User.findById(decoded.id).select("name username gender passwordChangedAt profilePicture isAdmin");

    if (!currentUser)
        return next(new AppError("The user belgons to this token is no longer exist", 401));
    const changed = currentUser.isPasswordChanged(decoded.iat);
    // console.log("password changed? in authController.protect ", changed)
    //check if user changed password after the token was issued;
    if (changed)
        return next(new AppError("The User Recently changed his password! Please Login Again.", 401))
    currentUser.passwordChangedAt = undefined;
    req.user = currentUser;

    next();

})


const forgotPassowrd = catchAsync(async (req, res, next) => {
    //get user based on POSTed Email
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        return res.status(200).json({
            status: "success",
            message: "token sent to email!"
        })
    //generate the random reset Token
    const resetToken = user.createPasswordResetToken();
    await user.save({ runValidators: false });
    //send it the user's email
    // const resetURL = `${req.protocol}://${req.get("host")}/api/users/reset-password/${resetToken}`;
    const resetURL = `${process.env.FRONTEND_URL}/authenticate/reset-password/${resetToken}`;
    const btnLink =
        `${req.get("origin")}/authenticate/reset-password/${resetToken}`;
    const html = generateHTML({
        user,
        link: resetURL,
        emailTitle: "Verify Your Account",
        emailSubTitle: "Tap the button below to verify your email address.",
        btnText: "Verify Account",
        btnLink: resetURL,
        belowLink: resetURL,
        footerNote:
            "You received this email because you were added as an admin on our website. If you did not initiate this action, please ignore this email.",
    });
    const message = `forgot your password? submit a POST 
    reqtuest with your new password and passsword confirtm to: ${resetURL}
    \n and if you didn't forget your password, please ignore this email!`
    try {
        await sendEmailGoogle({
            email: req.body.email,
            subject: "reset your password token (valid for  10min)",
            message,
            html,

        })

        res.status(200).json({
            status: "success",
            message: "token sent to email!"
        })
    }
    catch (err) {
        console.log(err, " in authController.161")
        user.passwordResetToken = undefined
        user.passwordResetExpiresAt = undefined
        await user.save({ validateBeforeSave: false });
        return next(new AppError("there was an error sending the mail, try again", 500));
    }
})


const resetPassword = catchAsync(async (req, res, next) => {
    const hashedToken = crypto.createHash("sha256")
        .update(req.params.token)
        .digest("hex")
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpiresAt:
        {
            $gt:
                Date.now()
        }

    })
    if (!user)
        return next(new AppError("token is invalid or has expired", 300))
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpiresAt = undefined;
    user.passwordChangedAt = Date.now()
    await user.save();

    const token = signToken(user._id);
    user.passwordChangedAt = undefined
    user.password = undefined
    user.createdAt = undefined
    user.updatedAt = undefined

    createSendToken(user, 200, res, req)
})


const restrictTo = (...roles) => {
    return (req, res, next) => {
        //roles ["admin"]
        if (!roles.includes(req.user.role))
            return next(new AppError("you don't have premission to perform this action", 403))
        next();

    }
}

module.exports = {
    register, login,
    protect, clearCookie,
    forgotPassowrd, resetPassword,
    clearAllCookies, getCookies
}