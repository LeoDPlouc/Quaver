import { Schema, model } from "mongoose"

interface IUser {
    username: string,
    password: string
}

const userSchema = new Schema<IUser>({
    username: {
        type: String,
        require: [true, "User needs a name"],
        unique: true
    },
    password: {
        type: String,
        require: [true, "User needs a password"]
    }
})
const User = model<IUser>("User", userSchema)

export { User, IUser }