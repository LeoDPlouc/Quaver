const fs = require("fs/promises")
const path = require("path")

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
    var song = await Song.findOne({ path: songPath })

    if (!song && path.extname(songPath) === ".mp3") {
        const songInfo = await songProcessor.getMetadata(songPath)

        song = new Song(songInfo)
        await song.save().then(() => console.log(`Found new song ${songPath}`))
    }

    song = await Song.findOne({ path: songPath })
    if (!song)
        return
    var album = await songProcessor.getAlbum(song)
    await album.save()

    song.albumId = album._id
    await song.save()
}


const doWork = async () => {

    console.log("Worker Started")

    while (true) {
        collect(musicPath)
        await new Promise(resolve => setTimeout(resolve, 30000))
    }
}

module.exports = doWork