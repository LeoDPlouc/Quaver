// Quaver is a self-hostable music player and music library manager
// Copyright (C) 2022  DPlouc
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import bcrypt from "bcryptjs"
import { Request, Response, NextFunction } from "express"
import { User } from "../models/userModel"
import logger from "../utils/logger"
import { validationResult } from "express-validator"

export async function signUp(req: Request, res: Response, next: NextFunction) {
    var err = validationResult(req)
    if (!err.isEmpty()) {
        return res.json({
            status: "fail"
        })
    }

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
        logger.crit(e)
        res.json({
            status: "fail"
        })
    }
}

export async function signIn(req: Request, res: Response, next: NextFunction) {
    var err = validationResult(req)
    if (!err.isEmpty()) {
        return res.json({
            status: "fail"
        })
    }

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
        logger.crit(e)
        res.json({
            status: "fail"
        })
    }
}