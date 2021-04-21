const express = require('express')
const router = express.Router()
const { encryptPassword, comparePassword } = require('../lib/secretPassword')
const { createToken } = require('../lib/libTokens')


const pool = require('../database')

router.post('/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body
    const newUser = {
        firstName,
        lastName,
        email,
        password: await encryptPassword(password)
    }
    await pool.query('INSERT INTO users set ?', [newUser])
    return res.status(201).json({
        loading: false,
        message: 'used created'
    })
})

router.post('/signin', async (req, res) => {
    const { email, password: receivedPassword } = req.body
    const verifiedUser = await pool.query('SELECT id, firstname, lastname, password FROM users WHERE email = ?', [email])
    const { id, firstname, lastname, password } = verifiedUser[0]
    const verifiedPassword = await comparePassword(receivedPassword, password)

    if(verifiedPassword) {
        const token = await createToken(id)
        res.json({
            token
        })
    } else {
        res.status(400)
    }
})

module.exports = router;