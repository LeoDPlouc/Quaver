const express = require("express")

const artistController = require("../controllers/artistController")
const protect = require("../middleware/authMiddleware")

const router = express.Router()


router.route("/")
    .get(protect, artistController.getAllArtists)

router.route("/:id")
    .get(protect, artistController.getOneArtist)
    .patch(protect, artistController.updateArtist)

module.exports = router