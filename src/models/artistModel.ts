import { Schema, model } from "mongoose"

interface IArtist {
    name?: string
    cover?: string
}

const artistSchema = new Schema<IArtist>({
    name: {
        type: String
    },
    cover: {
        type: String
    }
})
const Artist = model<IArtist>("Artist", artistSchema)

export { Artist, IArtist }