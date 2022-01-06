import { Router } from "express"
import Path from "path"

const router = Router()

router.route("/")
    .get((req, res) => res.sendFile(Path.join(__dirname, "../src/index.html")))

router.route("/src/:res")
    .get((req, res) => res.sendFile(Path.join(__dirname, `../src/${req.params.res}`)))

export = router