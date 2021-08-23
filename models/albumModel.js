const mongoose = require("mongoose")

const albumSchema = new mongoose.Schema({
    songs: {
        type: Array
    },
    title: {
        type: String
    },
    Artist: {
        type: String
    },
    cover: {
        type: String
    }
})

const Album = mongoose.model("Album", albumSchema)
module.exports = Album