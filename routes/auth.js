const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
 const verifyToken = require('../verifyToken')


// Register
router.post("/register", async (req, res) => {
    
    try {

        const { username, email, password } = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hashSync(password, salt)
        const newUSer = new User({
            username, email, password: hashedpassword
        })
        const savedUser = await newUSer.save()
        res.status(200).json(savedUser)

    } catch (err) {
        console.log(err);
        res.status(500).json(err)

    }
})


// Login
router.post("/login", async (req, res) => {
    
    try {
        console.log(req.body.email,"email");

        const user = await User.findOne({ email:req.body.email })
        console.log(req.body);
        
        if(!user) {
            return res.status(404).json("User not found!")
        }
        const match=await bcrypt.compare(req.body.password , user.password)

        if (!match) {
            return res.status(401).json("wrong password")
        }

        // generate JWT token
        const token = jwt.sign({ _id:user._id, username: user.username, email: user.email }, process.env.SECRET, { expiresIn: "3d" })
        const { password, ...info } = user._doc
        // console.log(info);
        
        console.log(token);
    

    
        // res.cookie("token", token, {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'None'

        // }).status(200).json(info)

        res.status(200).json({  token, role: 'user' ,user});

    } catch (err) {
        // console.log(err)
        res.status(500).json(err)
    }
})

// Logout
router.get("/logout", async (req, res) => {
    try {

        res.clearCookie("token", { sameSite: 'none', secure: true })
        res.status(200).json({message:"User logged out successfully"})

    } catch (err) {
        res.status(500).json(err)
    }
})

// Refetch

router.get("/refetch",verifyToken,async (req, res) => {
    try {

        console.log("User ID from token:", req.user._id);
        const user =await  User.findById(req.user._id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (err) {
        res.status(403).json({ message: "Invalid token" });
    }

    
})


module.exports = router