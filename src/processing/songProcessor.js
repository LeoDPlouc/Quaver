const mm = require("music-metadata")

const Album = require("../src/models/albumModel")
const Artist = require("../src/models/artistModel")

module.exports.getMetadata = async (songPath) => {
    var tag = await mm.parseFile(songPath)

    const song = {
        title: tag.common.title,
        n: tag.common.track.no,
        artist: tag.common.albumartist,
        album: tag.common.album,
        year: tag.common.year,
        duration: tag.format.duration,
        like: 0,
        path: songPath
    }

    return song
}

module.exports.getAlbum = async (song) => {
    var album = null
    if (song.albumId)
        album = await Album.findById(song.albumId)
    else
        album = await Album.findOne({ title: song.album, artist: song.artist })

    if (!album) {
        album = new Album({
            title: song.album,
            artist: song.artist
        })

        console.log(`Found new album ${album.title}`)
    }

    return album
}

module.exports.getArtist = async (song) => {
    var artist = null
    if (song.artistId)
        artist = await Artist.findById(song.artistId)
    else
        artist = await Artist.findOne({ name: song.artist })

    if (!artist) {
        artist = new Artist({
            name: song.artist
        })

        console.log(`Found new artist ${artist.name}`)
    }

    return artist
}