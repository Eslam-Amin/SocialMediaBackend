var recipes = require('../dummyData.json');
var router = require('express').Router();


router.get("/step/:id", async (req, res) => {

    const id = req.params.id;
    const element = recipes.filter((el) => { return el.id == id });
    if (element.length == 0)
        res.status(400).send("NOT_FOUND");
    else {
        const elapsedTime = req.query.elapsedTime ? req.query.elapsedTime : 0;
        if (elapsedTime == 0)
            res.status(200).send("0");
        else {
            res.status(200).send(element.id);
            element[0].timers.map((timer) => {
                if (timer > elapsedTime)
                    res.status(200).json({ "index": element.indexOf(element) });
            });
        }
    }


})
module.exports = router;

