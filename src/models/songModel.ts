import { Schema, model } from "mongoose"

interface ISong {
    title?: string,
    n?: number,
    duration?: Number,
    like?: Number,
    artist?: string,
    artistId?: string,
    album?: string,
    albumId?: string,
    path: string,
    acoustid?: string,
    year?: number
}

const songSchema = new Schema<ISong>({
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
    },
    year: {
        type: Number
    }
})
const Song = model<ISong>("Song", songSchema)

export { Song, ISong }