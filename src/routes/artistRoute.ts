import { Router } from "express"

import { getAllArtists, getArtistAlbums, getArtistSongs, getOneArtist, updateArtist } from "../controllers/artistController"
import { protect } from "../middleware/authMiddleware"

const router = Router()

router.route("/")
    .get(protect, getAllArtists)

router.route("/:id")
    .get(protect, getOneArtist)
    .patch(protect, updateArtist)

router.route("/:id/songs")
    .get(protect, getArtistSongs)

router.route("/:id/albums")
    .get(protect, getArtistAlbums)

export = router