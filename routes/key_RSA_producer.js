const express = require('express')
const router = express.Router()
const {KeyGenerator} = require('../helper/keyGenerator')

router.get('/generatePublicKey', (req,res) => {
    const publicKey = KeyGenerator()

    res.status(200).send(publicKey)
})

module.exports = router