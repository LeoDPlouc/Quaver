import { Router } from "express"

const router = Router()

router.route("/")
    .get((req, res) => res.sendFile("/app/res/index.html"))

router.route("/res/:type/:res")
    .get((req, res) => res.sendFile(`/app/res/${req.params.type}/${req.params.res}`))

export = router