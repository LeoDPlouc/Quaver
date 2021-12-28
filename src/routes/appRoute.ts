import { Router } from "express"

const router = Router()

router.route("/")
    .get((req, res) => res.sendFile("/app/src/index.html"))

router.route("/src/:res")
    .get((req, res) => res.sendFile(`/app/src/${req.params.res}`))

export = router