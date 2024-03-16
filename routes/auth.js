const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt")

//Register new User
router.post("/register", async (req, res) => {
    try {

        //hashing Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);


        //create new user
        const newUser = new User({
            name: req.body.name,
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            relationship: req.body.relationship,
            city: req.body.city,
            from: req.body.from,
            desc: req.body.desc
        });

        //save user and return respond
        const user = await newUser.save();

        res.status(200).json(user);
    }
    catch (err) {
        res.status(500).json(err);
    }

    /*const user = await new User({
        username:"ECaAmiNOo",
        email:"eca.amino@gmail.com",
        password:"eca is the best"

    });
    await user.save();
    res.send("ok");*/
})



//login 
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        const errMsg = "Either mail or password is INVALID";
        !user && res.status(404).json(errMsg);

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json(errMsg);
        res.status(200).json(user);
    }
    catch (err) {
        !res.statusCode && res.status(500).json(err)
    }
})

router.get("/", (req, res) => {
    res.send("hey it's auth Router")
})


module.exports = router;