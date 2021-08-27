const express = require("express")

const protect = require("../middleware/authMiddleware")

const router = express.Router()


router.route("/")
    .get((req, res) => res.sendFile("/app/src/index.html"))

router.route("/res/:type/:res")
    .get((req, res) => res.sendFile(`/app/src/${req.params.type}/${req.params.res}`))

module.exports = router