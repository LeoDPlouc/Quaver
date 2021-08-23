const fs = require("fs")
const path = require("path")

const songProcessor = require("../processing/songProcessor")
const Song = require("../models/songModel")

const musicPath = "/music"

const collect = async (libPath) => {
    try {
        fs.readdir(libPath, { withFileTypes: true }, (err, files) => {
            files.forEach((file) => {
                var fullPath = path.join(libPath, file.name)

                if (file.isDirectory())
                    collect(fullPath)

                if (file.isFile())
                    registerSong(fullPath)
            })
        })
    } catch (e) {
        console.log(e)
    }
}

const registerSong = async (songPath) => {
    songs = await Song.find({ path: songPath })
    
    if (songs.length == 0 && path.extname(songPath) === ".mp3") {
        const songInfo = await songProcessor.getSong(songPath)
        
        const song = new Song(songInfo)
        song.save().then(() => console.log(`Find new song ${songPath}`))
    }
}


const doWork = async () => {

    console.log("Worker Started")

    while (true) {
        collect(musicPath)
        await new Promise(resolve => setTimeout(resolve, 30000))
    }
}

module.exports = doWork