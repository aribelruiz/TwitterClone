const express = require('express');
const router = express.Router();
const { Users } = require('../models');
const bcrypt = require('bcrypt');
const { validateToken } = require('../middlewares/AuthMiddleware');
const { sign } = require('jsonwebtoken');

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

        // Using secret token to create access token
        const accessToken = sign({ username: user.username, id: user.id }, "gmsjgiobkqxqmhk");

        return res.json({token: accessToken, username: user.username, id: user.id});
    })

});

// Route for authorizing user
router.get("/authorized", validateToken, async (req, res) => {
    return res.json(req.user);
});

// Get user info by id 
router.get("/userinfo/:id", async (req, res) => {
    const id = req.params.id;

    const userInfo = await Users.findByPk(id, {
        attributes: {exclude: ['password']}
    });
    return res.json(userInfo);
});

// Update User password
router.put("/updatepassword", validateToken, async (req, res) => {
    const {oldPassword, newPassword} = req.body;
    const user = await Users.findOne({ where: {username: req.user.username}});

    // Check if old password matches user password
    bcrypt.compare(oldPassword, user.password).then(async (match) => {
        if (!match)
            return res.json({error: "Old password is incorrect."});

        bcrypt.hash(newPassword, 10).then((hash) => {
            Users.update({password: hash}, {where: {username: req.user.username}});
            res.json('Password successfully updated.');
        });

    });

});

module.exports = router;