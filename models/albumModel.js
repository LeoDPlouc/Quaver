const mongoose = require("mongoose")

const albumSchema = new mongoose.Schema({
    title: {
        type: String
    },
    artist: {
        type: String
    },
    artistId: {
        type: String
    },
    cover: {
        type: String
    }
})

const Album = mongoose.model("Album", albumSchema)
module.exports = Album