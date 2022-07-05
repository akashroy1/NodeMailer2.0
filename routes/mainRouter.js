const express = require("express")

const router = express.Router()

router.get('/', (req, res)=>{
    res.status(200).send("App Working")
})

module.exports = router