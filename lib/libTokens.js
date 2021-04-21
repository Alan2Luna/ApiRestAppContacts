const jwt = require('jsonwebtoken')

const createToken = async (id) => {
    const token = await jwt.sign({id}, 'my_secret_key', {
        expiresIn: 60 * 60
    })
    return token
}

const ensureToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization']
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ')
        const bearerToken = bearer[1]
        req.token = bearerToken
        next()
    } else {
        res.json({
            message: "token isn't ensure"
        })
    }
}

const verifiedToken = async (req, res) => {
    const token = req.token
    if(!token) {
        return res.status(401).json({
            message: 'No token provided'
        })
    }
    try {
        const decode = await jwt.verify(token, 'my_secret_key')
        return decode
    } catch(error) {
        return res.status(401).json({
            "message": "no token provided2"
        })
    }
}

module.exports = {
    createToken,
    ensureToken,
    verifiedToken
};