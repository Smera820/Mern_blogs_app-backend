const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const multer = require('multer')

app.use(cors())
const corsOptions = {
    origin: '+',
    credential: true
}

app.use(cors(corsOptions))

const ConnectDB = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URL)
        console.log("database connection established");


    } catch (err) {
        console.log(err);

    }
}

dotenv.config()
app.use(express.json())

app.listen(process.env.PORT, () => {
    ConnectDB()
    console.log("app listening on port " + process.env.PORT);


})