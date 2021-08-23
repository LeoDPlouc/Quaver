const express = require("express")

const songController = require("../controllers/songController")
const protect = require("../middleware/authMiddleware")

const router = express.Router()


router.route("/")
    .get(protect, songController.getAllSongs)

router.route("/:id")
    .get(protect, songController.getOneSong)
    .patch(protect, songController.updateSong)

module.exports = router