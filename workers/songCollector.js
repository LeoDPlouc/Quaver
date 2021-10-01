const fs = require("fs/promises")
const path = require("path")
const mime = require("mime")

const songProcessor = require("../processing/songProcessor")
const Song = require("../models/songModel")

const musicPath = "/music"

const collect = async (libPath) => {
    var paths = await fs.readdir(libPath, { withFileTypes: true })
    for (var i = 0; i < paths.length; i++) {
        var fullPath = path.join(libPath, paths[i].name)

        if (paths[i].isDirectory())
            await collect(fullPath)

        if (paths[i].isFile())
            await registerSong(fullPath)
    }
}

const registerSong = async (songPath) => {
    if (path.extname(songPath) != ".mp3")
        return

    var song = await Song.findOne({ path: songPath })

    if (!song) {
        const songInfo = await songProcessor.getMetadata(songPath)

        song = new Song(songInfo)
        await song.save().then(() => console.log(`Found new song ${songPath}`))
    }

    song = await Song.findOne({ path: songPath })
    var album = await songProcessor.getAlbum(song)
    await album.save()

    song.albumId = album._id
    await song.save()

    var artist = await songProcessor.getArtist(song)
    await artist.save()

    song.artistId = artist._id
    await song.save()

    album = await songProcessor.getAlbum(song)
    artist = await songProcessor.getArtist(song)
    album.artistId = artist._id
    await album.save()
}


const doWork = async () => {

    console.log("Song collection Started")

    while (true) {
        collect(musicPath)
        await new Promise(resolve => setTimeout(resolve, 30000))
    }
}

module.exports = doWork