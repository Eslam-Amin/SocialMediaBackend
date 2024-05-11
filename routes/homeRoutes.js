const router = require("express").Router();


router.get("/", (req, res, next) => {
    next();
})


module.exports = router;