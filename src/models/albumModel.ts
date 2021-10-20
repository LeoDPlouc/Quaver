import { Schema, model } from "mongoose"

interface IAlbum{
    title?: String,
    artist?: String,
    artistId?: String,
    cover?: String
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
    }
})
const Album = model<IAlbum>("Album", albumSchema)

export {IAlbum, Album} 