import { Schema, model } from "mongoose"

const artistSchema = new Schema({
    name: {
        type: String
    }
})

const Artist = model("Artist", artistSchema)
export = Artist