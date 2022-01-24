import express from "express"
import mongoose from "mongoose"
import session from "express-session"

import { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, SESSION_SECRET, APP_PORT, HEADLESS } from "./config/config"

import songRouter from "./routes/songRoute"
import userRouter from "./routes/userRoute"
import albumRouter from "./routes/albumRoute"
import artistRouter from "./routes/artistRoute"
import appRouter from "./routes/appRoute"
import imageRouter from "./routes/imageRoute"

import songCollector from "./workers/songCollector"

import { IUser } from "./models/userModel"

//Declare the objects stored in session
declare module 'express-session' {
    interface SessionData {
        user: IUser & mongoose.Document<any, any, IUser>
    }
}

const app = express()
const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

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
if (HEADLESS)
    app.use("/", appRouter)

app.use("/api/song", songRouter)
app.use("/api/user", userRouter)
app.use("/api/album", albumRouter)
app.use("/api/artist", artistRouter)
app.use("/api/image", imageRouter)

//Connect to the db
async function waitForDb() {
    await mongoose
        .connect(mongoUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            dbName: "quaver"
        })
        .then(() => console.log("Successfully connected to database"))
        .catch((e) => {
            console.log(e)
            //retry connection
            setTimeout(waitForDb, 5000)
        })
}

waitForDb().then(() => {
    //Start collection of the songs
    songCollector()

    //Open server
    app.listen(APP_PORT, () => console.log(`listening on port ${APP_PORT}`))
})