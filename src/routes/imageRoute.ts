import { Router } from "express"

import { getAllImagesInfo, getImage, getOneImageInfo } from "../controllers/imageController"
import { protect } from "../middleware/authMiddleware"

const router = Router()

router.route("/")
    .get(protect, getAllImagesInfo)

router.route("/:id")
    .get(protect, getOneImageInfo)

router.route("/:id/file")
    .get(protect, getImage)

export = router