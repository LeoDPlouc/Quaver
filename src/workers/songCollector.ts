import fs from "fs/promises"
import path from "path"
import mm from "mime-types"

import { getAlbum, getArtist, getMetadata } from "../processing/songProcessor"
import { Song } from "../models/songModel"

import { MUSIC_PATH } from "../config/config"

async function collect(libPath: string) {
    var paths = await fs.readdir(libPath, { withFileTypes: true })
    for (var i = 0; i < paths.length; i++) {
        var fullPath = path.join(libPath, paths[i].name)

        if (paths[i].isDirectory())
            await collect(fullPath)

        if (paths[i].isFile())
            await registerSong(fullPath)
    }
}

async function registerSong(songPath: string) {

    if (!(mm.lookup(path.extname(songPath)) as string).match("audio"))
        return

    var song = await Song.findOne({ path: songPath })

    if (!song) {
        const songInfo = await getMetadata(songPath)

        song = new Song(songInfo)
        await song.save().then(() => console.log(`Found new song ${songPath}`))
    }

    song = await Song.findOne({ path: songPath })
    var album = await getAlbum(song)
    await album.save()

    song.albumId = album._id
    await song.save()

    var artist = await getArtist(song)
    await artist.save()

    song.artistId = artist._id
    await song.save()

    album = await getAlbum(song)
    artist = await getArtist(song)
    album.artistId = artist._id
    await album.save()
}


async function doWork() {

    console.log("Song collection Started")

    while (true) {
        collect(MUSIC_PATH)
        await new Promise(resolve => setTimeout(resolve, 30000))
    }
}

export = doWork