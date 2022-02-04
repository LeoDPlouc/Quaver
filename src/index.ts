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

import express from "express"
import mongoose from "mongoose"
import session from "express-session"

import { SESSION_SECRET, APP_PORT, HEADLESS } from "./config/config"

import songRouter from "./routes/songRoute"
import userRouter from "./routes/userRoute"
import albumRouter from "./routes/albumRoute"
import artistRouter from "./routes/artistRoute"
import appRouter from "./routes/appRoute"
import imageRouter from "./routes/imageRoute"

import songCollector from "./workers/songCollector"

import { IUser } from "./models/userModel"
import { waitForDb } from "./db/initdb"

//Declare the objects stored in session
declare module 'express-session' {
    interface SessionData {
        user: IUser & mongoose.Document<any, any, IUser>
    }
}

const app = express()

//Init session
app.use(session({
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 2600000000
    }
}))

//Parse request's body to json
app.use(express.json())

//Declare routes
//Dont declare the root path if in headless mode
if (!HEADLESS)
    app.use("/", appRouter)

app.use("/api/song", songRouter)
app.use("/api/user", userRouter)
app.use("/api/album", albumRouter)
app.use("/api/artist", artistRouter)
app.use("/api/image", imageRouter)

//Connect to the db
waitForDb().then(() => {
    //Start collection of the songs
    songCollector()

    //Open server
    app.listen(APP_PORT, () => console.log(`listening on port ${APP_PORT}`))
})