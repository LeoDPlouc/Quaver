const bcrypt = require("bcryptjs")

const User = require("../models/userModel")

exports.signUp = async (req, res, next) => {
    try {
        var { username, password } = req.body
        var hashpass = await bcrypt.hash(password, 5)

        const user = await User.create({
            "username": username,
            "password": hashpass
        })

        res.status(200).json({
            status: "sucess",
            data: {
                user: user
            }
        })
    } catch (e) {
        console.log(e)
        res.status(400).json({
            status: "fail"
        })
    }
}

exports.signIn = async (req, res, next) => {
    try {
        var { username, password } = req.body

        var user = await User.findOne({ username })

        if (!user) {
            res.status(400).json({
                status: "fail"
            })
            return
        }

        var checked = await bcrypt.compare(password, user.password)
        if (!checked) {
            res.status(400).json({
                status: "fail"
            })
            return
        }

        req.session.user = user
        res.status(200).json({
            status: "sucess"
        })

    } catch (e) {
        res.status(404).json({
            status: "fail"
        })
    }
}