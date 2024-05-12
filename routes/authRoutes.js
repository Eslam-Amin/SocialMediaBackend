const router = require("express").Router();

const authController = require("./../controllers/authController");

//Register new User
router.post("/register", authController.register)

//login 
router.post("/login", authController.login);
router.get("/clear-cookie", authController.clearCookie);

module.exports = router;