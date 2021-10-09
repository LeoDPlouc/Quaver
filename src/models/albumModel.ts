import { Schema, model } from "mongoose"

const albumSchema = new Schema({
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

const Album = model("Album", albumSchema)
export = Album