const Artist = require("../models/artistModel")

module.exports.getArtist = async (album) => {
    var artist = null
    if (album.artistId)
        artist = await Artist.findById(album.artistId)
    else {
        artist = new Artist({
            name: song.artist
        })

        console.log(`Found new artist ${artist.name}`)
    }

    return artist
}