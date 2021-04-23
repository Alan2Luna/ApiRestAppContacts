const express = require('express')
const router = express.Router()

router.get('/prueba', (req, res) => {
    res.json({
        message: 'todo bien'
    })
})