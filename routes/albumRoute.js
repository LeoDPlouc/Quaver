const express = require("express")

const albumController = require("../controllers/albumController")
const protect = require("../middleware/authMiddleware")

const router = express.Router()


router.route("/")
    .get(protect, albumController.getAllAlbums)

router.route("/:id")
    .get(protect, albumController.getOneAlbum)
    .patch(protect, albumController.updateAlbum)

module.exports = router