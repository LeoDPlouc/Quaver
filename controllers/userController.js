const bcrypt = require("bcryptjs")

const User = require("../models/userModel")

exports.signUp = async (req, res, next) => {
    try {
        var { username, password } = req.body
        var hashpass = await bcrypt.hash(password)

        const user = User.create({ username, hashpassword })

        res.status(200).json({
            status: "sucess",
            data: {
                user: user
            }
        })
    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.signIn = async (req, res, next) => {
    try {
        var { username, password } = req.body

        var user = await User.findOne({ username })

        if (!user)
            res.status(400)

        var checked = await bcrypt.compare(password, user.password)
        if (!checked)
            res.status(400)

        res.status(200).json({
            status: "sucess"
        })

    } catch (e) {
        res.status(404).json({
            status: "fail"
        })
    }
}