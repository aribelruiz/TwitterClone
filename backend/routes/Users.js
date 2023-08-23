const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');

// Route for Registration
router.post("/", async (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash,
        });

        res.json("SUCCESS");
    });
});

// Route for Login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    const user = await Users.findOne({ where: {username: username}});

    if (!user)
        return res.json({error: "User does not exist."});

    bcrypt.compare(password, user.password).then((match) => {
        if (!match)
            return res.json({error: "Wrong username and password combination."});

        return res.json("Login successful.");
    })

});

module.exports = router;