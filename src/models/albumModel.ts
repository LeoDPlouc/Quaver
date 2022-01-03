import { Schema, model } from "mongoose"

interface IAlbum{
    title?: String,
    artist?: String,
    artistId?: String,
    cover?: String,
    year?: string
}

const albumSchema = new Schema<IAlbum>({
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
    },
    year: {
        type: String
    }
})
const Album = model<IAlbum>("Album", albumSchema)

export {IAlbum, Album} 