const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const Post = require('../models/Post')
const Comments = require('../models/Comments')
const verifyToken = require('../verifyToken')


// Create
router.post("/create", verifyToken, async (req, res) => {
    try {

        const { comment, author, postId, userId } = req.body;
        if (!comment || !author || !postId || !userId) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        console.log("Received Comment Data:", req.body);

        const newComment = new Comments(req.body)
        const savedComment = await newComment.save()
        res.status(200).json(savedComment)

    }
    catch (err) {
        res.status(500).json(err)
    }
})

// Update
router.put("/:id", verifyToken, async (req, res) => {
    try {
        const updatedComment = await Comments.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })

        if (!updatedComment) {
            return res.status(404).json({ message: "Comment not found" });
        }
        res.status(200).json(updatedComment)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

// Delete
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        await Comments.findByIdAndDelete(req.params.id)
        res.status(200).json("Comment deleted")

    }
    catch (err) {
        res.status(500).json(err)
    }
})

// Get post comment
router.get("/post/:postId", async (req, res) => {
    try {
        const comments = await Comments.find({ postId: req.params.postId })
        res.status(200).json(comments)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router
