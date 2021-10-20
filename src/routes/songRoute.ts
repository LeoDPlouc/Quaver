import { Router } from "express"

import { getAllSongs, getOneSong, updateSong } from "../controllers/songController"
import { protect } from "../middleware/authMiddleware"

const router = Router()

router.route("/")
    .get(protect, getAllSongs)

router.route("/:id")
    .get(protect, getOneSong)
    .patch(protect, updateSong)

export = router