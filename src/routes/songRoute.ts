import { Router } from "express"

import { getAllSongsInfo, getOneSongInfo, updateSongInfo, getSongStream } from "../controllers/songController"
import { protect } from "../middleware/authMiddleware"

const router = Router()

router.route("/")
    .get(protect, getAllSongsInfo)

router.route("/:id")
    .get(protect, getOneSongInfo)
    .patch(protect, updateSongInfo)

router.route("/:id/stream")
    .get(protect, getSongStream)

export = router