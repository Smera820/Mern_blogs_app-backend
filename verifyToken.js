const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]
    console.log("Raw Authorization header:", token)

    if (!token) {
        return res.status(403).json({ message: "you are not authenticated" })

    }

    jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "invalid token" })
        }
        req.user = user

        next()
    })

}

module.exports = verifyToken