const express = require('express');
const router = express.Router();
const { Posts, Likes } = require('../models');

const {validateToken} = require('../middlewares/AuthMiddleware');

router.get("/", validateToken, async (req, res) => {
    const listOfPosts = await Posts.findAll({include: [Likes]});
    const likedPosts = await Likes.findAll({where: { UserId: req.user.id }})

    res.json({ listOfPosts, likedPosts });
});

// Get post by postId
router.get("/postById/:id", async (req, res) => {
    const id =  req.params.id;
    const post = await Posts.findByPk(id);

    res.json(post);
});

// Get all user posts by userId
router.get("/postsByUser/:id", async (req, res) => {

    const id = req.params.id;
    const userPosts = await Posts.findAll({where: { UserId: id }, include: [Likes]});

    res.json({userPosts});
});

// Create post
router.post("/", validateToken, async (req, res) => {
    const post = req.body;
    post.username = req.user.username;
    post.UserId = req.user.id; 

    await Posts.create(post);

    res.json(post);
});

// Delete  post
router.delete("/:postId", validateToken, async (req, res) => {
    const postId = req.params.postId;
    
    await Posts.destroy({where: {id: postId}});
    return res.json("DELETED POST SUCCESSFULLY");
});

module.exports = router;