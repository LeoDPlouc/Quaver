import bcrypt from "bcryptjs"
import { Request, Response, NextFunction } from "express"

import { User } from "../models/userModel"

export async function signUp(req: Request, res: Response, next: NextFunction) {
    try {
        var { username, password } = req.body
        var hashpass = await bcrypt.hash(password, 5)

        const user = new User({
            "username": username,
            "password": hashpass
        })
        await user.save()
        
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

export async function signIn(req: Request, res: Response, next: NextFunction) {
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