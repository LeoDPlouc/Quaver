import { Schema, model } from "mongoose"

const songSchema = new Schema({
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
    artistId: {
        type: String
    },
    album: {
        type: String
    },
    albumId: {
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

const Song = model("Song", songSchema)
export = Song