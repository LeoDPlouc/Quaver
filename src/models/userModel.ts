import { Schema, model } from "mongoose"

const userSchema = new Schema({
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

const User = model("User", userSchema)
export = User