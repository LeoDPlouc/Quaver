const express = require("express")
const mongoose = require("mongoose")

const app = express()

app.get("/", (req, res) => {
    res.send(`<h1>Db status ${e}<h1/>`)
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`listening on port ${port}`))