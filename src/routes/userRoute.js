const express = require("express")
const userController = require("../controllers/userController")

const router = express.Router()

router.route("/signin")
    .post(userController.signIn)

router.route("/signup")
    .post(userController.signUp)

module.exports = router