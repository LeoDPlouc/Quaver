import bcrypt from "bcryptjs"
import { Request, Response, NextFunction } from "express"

import { User } from "../models/userModel"

export async function signUp(req: Request, res: Response, next: NextFunction) {
    try {
        var { username, password } = req.body
        //Hash the password with salt
        var hashpass = await bcrypt.hash(password, 5)

        //Create a new user
        const user = new User({
            "username": username,
            "password": hashpass
        })
        await user.save()
        
        res.json({
            status: "sucess",
            data: {
                user: user
            }
        })
    } catch (e) {
        console.log(e)
        res.json({
            status: "fail"
        })
    }
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
    try {
        var { username, password } = req.body

        var user = await User.findOne({ username })

        //If the no user have the username requested, fail
        if (!user) {
            res.json({
                status: "fail"
            })
            return
        }

        //If the password is wrong, fail
        var checked = await bcrypt.compare(password, user.password)
        if (!checked) {
            res.json({
                status: "fail"
            })
            return
        }

        //Store the user in session
        req.session.user = user
        res.json({
            status: "sucess"
        })

    } catch (e) {
        res.json({
            status: "fail"
        })
    }
}