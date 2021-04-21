const express = require('express')
const router = express.Router()
const { ensureToken, verifiedToken } = require('../lib/libTokens')

const pool = require('../database')

router.get('/', ensureToken, async (req, res) => {
    const decode = await verifiedToken(req, res)
    if(decode.id) {
        const { id: user_id } = decode
        const contacts = await pool.query('SELECT id, fullname, email, phone FROM contacts WHERE user_id = ?', [user_id])
        if(contacts.length > 0) {
            res.json({
                contacts
                })
        } else {
            res.json({
                message: 'you dont have contacts yet'
            })
        }
    } else {
        return decode
    }
})

router.post('/add', ensureToken, async (req, res) => {
    const decode = await verifiedToken(req, res)
    if(decode.id) {
        const { fullname, phone, email } = req.body
        const { id: user_id } = decode
        const newContact = {
            fullname,
            phone,
            email,
            user_id
        }
        await pool.query('INSERT INTO contacts set ?', [newContact])
        return res.json({ message: "USER CREATED"})
    } else {
        res.status(404).end()
    }
})

router.delete('/delete/:id', ensureToken, async (req, res) => {
    const decode = await verifiedToken(req, res)
    if(decode.id) {
        const { id: user_id } = decode
        const { id } = req.params
        await pool.query('DELETE FROM contacts WHERE id = ? AND user_id = ?', [id, user_id])
        res.status(204).end()
    } else{
        res.status(404).end()
    }
})

router.put('/edit/:id', ensureToken, async (req, res) => {
    const decode = await verifiedToken(req, res)
    if(decode.id) {
        const { id: user_id } = decode
        const { id } = req.params
        const { fullname, phone, email } = req.body
        const newContact = {
            fullname,
            phone,
            email
        }
        await pool.query('UPDATE contacts SET ? WHERE id = ? AND user_id = ?', [newContact, id, user_id])
        return res.status(200).json({
            message: "contacto editado"
        })
    } else{
        res.status(404).end()
    }
})

module.exports = router