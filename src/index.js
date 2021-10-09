const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, SESSION_SECRET } = require("./config/config")

const songRouter = require("./routes/songRoute")
const userRouter = require("./routes/userRoute")
const albumRouter = require("./routes/albumRoute")
const artistRouter = require("./routes/artistRoute")
const appRouter = require("./routes/appRoute")

const songCollector = require("./workers/songCollector")

const app = express()

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`

const waitForDb = () => {
    mongoose
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

waitForDb()

app.use(session({
    secret: SESSION_SECRET,
    cookie: {
        secure: false,
        resave: false,
        saveUninitialized: false,
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

songCollector()

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}`))

