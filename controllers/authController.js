const crypto = require("crypto");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const ApiError = require("../utils/ApiError");
const catchAsync = require("./../utils/catchAsync");
const generateHTML = require("./../utils/generateHTML");
const { sendEmail, sendEmailGoogle } = require("./../utils/email");

const removeSensitiveDataOfUser = (user) => {
  user.password = undefined;
  user.sessionId = undefined;
  user.verificationToken = undefined;
  user.passwordChangedAt = undefined;
  user.verifyTokenExpiresAt = undefined;
};
const signToken = (id) => {
  return jwt.sign(
    {
      id
    },
    process.env.JWT_SEC,
    {
      expiresIn: process.env.JWT_EXPIRES_IN
    }
  );
};

const createSendToken = async (user, statusCode, res, req) => {
  const expiryDate = new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  );
  const cookieOptions = {
    expires: expiryDate,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
  };
  const legacyOptionsSecure = {
    expires: expiryDate,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: expiryDate,
    path: "/"
  };

  const token = signToken(user._id);
  // req.headers["Authorization"] = `Bearer ${token}`
  res.setHeader("Authorization", `Bearer ${token}`);

  // res.cookie("token", token, cookieOptions)
  // res.cookie("tokenLegacySecure", token, legacyOptionsSecure)

  console.log("🚀---- Cookies in createAndSendToken -----🚀");
  console.log(token);
  console.log(res.cookies);
  console.log("🚀---- Cookies in createAndSendToken -----🚀");

  let hashedSessionId = crypto
    .createHash("sha256")
    .update(req.sessionID)
    .digest("hex");
  user.sessionId = hashedSessionId;
  await user.save();
  removeSensitiveDataOfUser(user);

  res.status(statusCode).json({
    status: "success",
    user,
    token
  });
};

const clearCookie = (req, res, next) => {
  res.clearCookie("connect.sid");
  req.session.destroy();

  console.log(req.cookies);
  return res
    .cookie("token", "loggedOut", {
      expires: new Date(
        Date.now() - process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      )
    })
    .json({
      status: "success",
      message: "cookies are cleared"
    });
};

const clearAllCookies = (req, res, next) => {
  for (let cookieName in req.cookies) {
    res.cookie(cookieName, "", { expires: new Date(0) });
  }
  res.send("all Cookies Has been Deleted");
};

const getCookies = (req, res, next) => {
  let cookies = [];
  for (let cookieName in req.cookies) {
    cookies.push(req.cookies[cookieName]);
  }

  res.send("All Cookies " + cookies.join(","));
};

const register = catchAsync(async (req, res, next) => {
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
    passwordChangedAt: req.body.passwordChangedAt
  });
  //save user and return respond
  const user = await newUser.save();
  // removeSensitiveDataOfUser(user)

  return await sendTokenToEmail("account")(req, res, next);
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new ApiError("please Provide email or password", 401));

  const user = await User.findOne({ email: email?.toLowerCase() }).select(
    "+password -passwordChangedAt"
  );

  if (!user || !(await user.validPassword(password, user.password)))
    return next(new ApiError("Either mail or password is INVALID", 401));
  if (!user.verified) {
    return await sendTokenToEmail("account")(req, res, next);
    // return next(new ApiError("Email Isn't Verfied\nA verification link has been sent to your email", 401))
  }
  req.headers.authorization = "Bearer " + signToken(user._id);
  createSendToken(user, 200, res, req);
});

const protect = catchAsync(async (req, res, next) => {
  //let token = null;
  let token = req.headers.authorization || false;
  // console.log("🚀---- Tokens in protect -----🚀")
  // console.log("Cookies=> ", req.cookies)
  // console.log("Header Auth=> ", req.headers.authorization)
  // console.log("🚀---- Tokens in protect -----🚀")
  if (!token)
    return next(
      new ApiError(
        "you're not logged In, Please Login to get access, Specify Cookie",
        401
      )
    );
  if (token.startsWith("Bearer"))
    token = req.headers.authorization.split(" ")[1];
  else if (req.cookies["token"]) token = req.cookies["token"];
  else if (req.cookies["tokenLegacySecure"])
    token = req.cookies["tokenLegacySecure"];
  const decoded = jwt.verify(token, process.env.JWT_SEC);
  const currentUser = await User.findById(decoded.id).select(
    "name username gender passwordChangedAt profilePicture isAdmin verified sessionId"
  );
  if (!currentUser)
    return next(
      new ApiError("The user belongs to this token is no longer exist", 401)
    );
  const hashedSessionId = crypto
    .createHash("sha256")
    .update(req.sessionID)
    .digest("hex");
  if (currentUser.sessionId !== hashedSessionId) {
    // console.log("this user Already has an opened session, logging out...");
    req.session.destroy();
    res.clearCookie("connect.sid");
    return next(
      new ApiError(
        "this user Already has an opened session, logging out...",
        401
      )
    );
  }
  const changed = currentUser.isPasswordChanged(decoded.iat);
  // console.log("password changed? in authController.protect ", changed)
  //check if user changed password after the token was issued;
  if (changed)
    return next(
      new ApiError(
        "The User Recently changed his password! Please Login Again.",
        401
      )
    );
  if (!currentUser.verified)
    return next(new ApiError("This user isn't verified.", 401));
  removeSensitiveDataOfUser(currentUser);
  req.user = currentUser;

  next();
});

const sendTokenToEmail = (option) =>
  catchAsync(async (req, res, next) => {
    let user;
    if (req.user) user = req.user;
    else user = await User.findOne({ email: req.body.email });
    let emailTitle = `Verify Your Account`;
    let emailSubTitle = `Tap the button below to verify your email address.`;
    let btnText = "Verify Account";
    let footerNote = `You received this email because you were added as a user on our website. If you did not initiate this action, please ignore this email.`;
    // let emailGreeting = `Hi ${user.firstName}, Welcome to Hajjo Store!`
    let resetToken;

    if (option === "account") {
      resetToken = user.createEmailToken();
    } else {
      emailTitle = `Reset Your Account password`;
      emailSubTitle = `Tap the button below to Reset your password.`;
      btnText = "Reset Password";
      footerNote = `You received this email because you requested to reset your password, If you did not initiate this action, please ignore this email.`;
      resetToken = user.createPasswordResetToken();
    }
    await user.save();
    // Send email
    const resetURL = `${process.env.FRONTEND_URL}/authenticate/${
      option === "account" ? "verify-account" : "reset-password"
    }/${resetToken}`;
    const btnLink = `${req.get("origin")}/authenticate/${
      option === "account" ? "verify-account" : "reset-password"
    }/${resetToken}`;
    const html = generateHTML({
      user,
      link: resetURL,
      emailTitle,
      emailSubTitle,
      btnText,
      btnLink: resetURL,
      belowLink: resetURL,
      footerNote:
        "You received this email because you were added as an admin on our website. If you did not initiate this action, please ignore this email."
    });
    try {
      await sendEmailGoogle({
        email: user.email,
        subject: `${process.env.APP_NAME} account verification (Valid for 10mins)`,
        html: html
      });
    } catch (err) {
      console.log(err);
      return next(
        new ApiError(
          "Unable to send verification email, please try again later.",
          422
        )
      );
    }
    // Response
    res.status(200).json({
      success: true,
      msg: "Verification email is sent to your email address"
    });
  });

/**
 *
 * @param Model this is the global Model For User, Admin, etc..
 * @returns a response whether the link to verify his email is valid or not
 * if valid, then verify his account it not then send him that
 */
const verifyAccount = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    verificationToken: hashedToken,
    verifyTokenExpiresAt: {
      $gt: Date.now()
    }
  });
  if (!user)
    return next(new ApiError("Token is Expired!, Please Try Again", 400));
  // Check if user is already verified
  if (user.verified)
    return next(new ApiError("This account is already verified", 400));
  // Input validation

  user.verified = true;
  user.sessionId = req.sessionID;
  await user.save();
  createSendToken(user, 200, res, req);
  // // Response
  // res.status(200).json({
  //     success: true,
  //     msg: "your account is verified successfully",
  //     data: user,
  //     token,
  //     tokenExpDate
  // });
});

const forgotPassword = catchAsync(async (req, res, next) => {
  await sendTokenToEmail("password-token")(req, res, next);
});

const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpiresAt: {
      $gt: Date.now()
    }
  });
  if (!user) return next(new ApiError("token is invalid or has expired", 300));
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpiresAt = undefined;
  user.passwordChangedAt = Date.now();
  // user.passwordChangedAt = undefined
  // user.password = undefined
  // user.createdAt = undefined
  // user.updatedAt = undefined

  createSendToken(user, 200, res, req);
});

const restrictTo = (...roles) => {
  return (req, res, next) => {
    //roles ["admin"]
    if (!roles.includes(req.user.role))
      return next(
        new ApiError("you don't have permission to perform this action", 403)
      );
    next();
  };
};

module.exports = {
  register,
  login,
  protect,
  clearCookie,
  forgotPassword,
  resetPassword,
  clearAllCookies,
  getCookies,
  verifyAccount
};
