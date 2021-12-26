import express from "express"
import mongoose from "mongoose"
import session from "express-session"

import { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, SESSION_SECRET, APP_PORT } from "./config/config"

import songRouter from "./routes/songRoute"
import userRouter from "./routes/userRoute"
import albumRouter from "./routes/albumRoute"
import artistRouter from "./routes/artistRoute"
import appRouter from "./routes/appRoute"
import imageRouter from "./routes/imageRoute"

import songCollector from "./workers/songCollector"

import { IUser } from "./models/userModel"

declare module 'express-session' {
    interface SessionData {
        user: IUser & mongoose.Document<any, any, IUser>
    }
}

const app = express()

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

app.use(session({
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 2600000000
    }
}))

app.use(express.json())

app.use("/", appRouter)

app.use("/api/song", songRouter)
app.use("/api/user", userRouter)
app.use("/api/album", albumRouter)
app.use("/api/artist", artistRouter)
app.use("/api/image", imageRouter)

async function waitForDb() {
    await mongoose
        .connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false
        })
        .then(() => console.log("Successfully connected to database"))
        .catch((e) => {
            console.log(e)
            setTimeout(waitForDb, 5000)
        })
}

waitForDb().then(() => {
    songCollector()
    
    app.listen(APP_PORT, () => console.log(`listening on port ${APP_PORT}`))
})