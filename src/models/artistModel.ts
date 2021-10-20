import { Schema, model } from "mongoose"

interface IArtist {
    name?: string
}

const artistSchema = new Schema<IArtist>({
    name: {
        type: String
    }
})
const Artist = model<IArtist>("Artist", artistSchema)

export { Artist, IArtist }