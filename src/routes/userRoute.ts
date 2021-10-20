import { Router } from "express"
import { signIn, signUp } from "../controllers/userController"

const router = Router()

router.route("/signin")
    .post(signIn)

router.route("/signup")
    .post(signUp)

export = router