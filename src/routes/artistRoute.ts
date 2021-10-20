import { Router } from "express"

import { getAllArtists, getOneArtist, updateArtist } from "../controllers/artistController"
import { protect } from "../middleware/authMiddleware"

const router = Router()

router.route("/")
    .get(protect, getAllArtists)

router.route("/:id")
    .get(protect, getOneArtist)
    .patch(protect, updateArtist)

export = router