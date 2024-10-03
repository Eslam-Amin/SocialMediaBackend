const router = require("express").Router();

const authController = require("./../controllers/authController");

//Register new User
router.post("/register", authController.register);

//login
router.post("/login", authController.login);
router.get("/clear-cookie", authController.clearCookie);
router.post("/forget-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.get("/clear-all-cookies", authController.clearAllCookies);
router.get("/get-cookies", authController.getCookies);

router.route("/verify-account/:token").post(authController.verifyAccount);
module.exports = router;
