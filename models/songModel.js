const mongoose = require("mongoose")

const songSchema = new mongoose.Schema({
    title: {
        type: String
    },
    n: {
        type: Number
    },
    duration: {
        type: Number
    },
    like: {
        type: Number
    },
    artist: {
        type: String
    },
    album: {
        type: String
    },
    path: {
        type: String,
        require: [true, "Song must have a path"]
    },
    acoustid: {
        type: String
    }
})

const Song = mongoose.model("Song", songSchema)
module.exports = Song