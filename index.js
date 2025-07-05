const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const cookieParser = require('cookie-parser')
const authRoute = require('./routes/auth')
const userRoute = require('./routes/user')
const postRoute = require('./routes/post')
const commentRoute = require('./routes/comments')


const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
};
app.use(cors(corsOptions))


const ConnectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URL)
        console.log("database connection established");


    } catch (err) {
        console.log(err);

    }
}

// middleware
dotenv.config()
app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));
console.log(cors())

app.use(cookieParser())

// route handlers
app.use("/api/auth", authRoute)
app.use("/api/user", userRoute)
app.use("/api/post", postRoute)
app.use("/api/comments", commentRoute)
app.use('/upload', express.static('uploads'))

// upload image
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images")
    },
    filename: (req, file, cb) => {
        cb(null, req.body.img)
    }
})
const upload = multer({ storage: storage })
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json({ message: "Image uploaded successfully", filename: req.file.filename })
})




app.listen(process.env.PORT, () => {
    ConnectDB()
    console.log("app listening on port " + process.env.PORT);


})