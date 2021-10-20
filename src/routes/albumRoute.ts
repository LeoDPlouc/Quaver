import { Router } from "express"

import { getAllAlbums, getOneAlbum, updateAlbum } from "../controllers/albumController"
import { protect } from "../middleware/authMiddleware"

const router = Router()


router.route("/")
    .get(protect, getAllAlbums)

router.route("/:id")
    .get(protect, getOneAlbum)
    .patch(protect, updateAlbum)

export = router