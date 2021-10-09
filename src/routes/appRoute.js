const express = require("express")

const protect = require("../middleware/authMiddleware")

const router = express.Router()


router.route("/")
    .get((req, res) => res.sendFile("/app/res/index.html"))

router.route("/res/:type/:res")
    .get((req, res) => res.sendFile(`/app/res/${req.params.type}/${req.params.res}`))

module.exports = router