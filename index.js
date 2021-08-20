const express = require("express")
const mongoose = require("mongoose")
const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT } = require("./config/config")

const app = express()

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
mongoose
    .connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
    .then(() => console.log("Successfully connected to database"))
    .catch((e) => console.log(e))



app.get("/", (req, res) => {
    res.send(`<h1>Db status ${e}<h1/>`)
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}`))