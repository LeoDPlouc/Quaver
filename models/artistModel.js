const mongoose = require("mongoose")

const artistSchema = new mongoose.Schema({
    albums: {
        type: Array
    },
    name: {
        type: String
    }
})

const Artist = mongoose.model("Artist", artistSchema)
module.exports = Artist