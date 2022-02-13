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
import session from "express-session"
import { HEADLESS, SESSION_SECRET } from "./config/config"
import logMiddleware from "./middleware/logMiddleware"
import songRouter from "./routes/songRoute"
import userRouter from "./routes/userRoute"
import albumRouter from "./routes/albumRoute"
import artistRouter from "./routes/artistRoute"
import appRouter from "./routes/appRoute"
import imageRouter from "./routes/imageRoute"


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

app.use(logMiddleware)

//Declare routes
app.use("/api/song", songRouter)
app.use("/api/user", userRouter)
app.use("/api/album", albumRouter)
app.use("/api/artist", artistRouter)
app.use("/api/image", imageRouter)

//Dont declare the root path if in headless mode
if (!HEADLESS)
    app.use("/", appRouter)

export default app