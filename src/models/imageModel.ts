import { Schema, model } from "mongoose"

interface IImage {
    path: string,
    resolution: string,
}

const imageSchema = new Schema<IImage>({
    path: {
        type: String,
        require: [true, "Image must have a path"]
    },
    resolution: {
        type: String
    }
})
const Image = model<IImage>("Image", imageSchema)

export { Image, IImage }