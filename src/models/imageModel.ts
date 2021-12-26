import { Schema, model } from "mongoose"

enum ImageType {
    albumCover = "ALBUMCOVER"
}

interface IImage {
    path: string,
    resolution: string,
    type: ImageType
}

const imageSchema = new Schema<IImage>({
    path: {
        type: String,
        require: [true, "Image must have a path"]
    },
    resolution: {
        type: String
    },
    type: {
        type: String,
        enum: ImageType
    }
})
const Image = model<IImage>("Image", imageSchema)

export { Image, IImage, ImageType }