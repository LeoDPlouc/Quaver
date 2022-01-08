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
            await registerSong(path.resolve(fullPath))
    }
}

async function registerSong(songPath: string) {

    //Only considere audio files
    if (!(mm.lookup(path.extname(songPath)) as string).match("audio"))
        return

    var song = await Song.findOne({ path: songPath })

    //If the song doesn't already exist, extract its metadata and create a new song
    if (!song) {
        const songInfo = await getMetadata(songPath)

        song = new Song(songInfo)
        await song.save().then(() => console.log(`Found new song ${songPath}`))
    }

    //Fetch the song's album
    song = await Song.findOne({ path: songPath })
    var album = await getAlbum(song)
    await album.save()

    //Save the albumId in the song
    song.albumId = album._id
    await song.save()

    //Fetch the song's artist
    var artist = await getArtist(song)
    await artist.save()

    //Save the artistId in the song
    song.artistId = artist._id
    await song.save()

    //Save the artistid in the album
    album = await getAlbum(song)
    artist = await getArtist(song)
    album.artistId = artist._id
    await album.save()
}


async function doWork() {

    console.log("Song collection Started")

    //Collection run in background and is relaunched every 30 sec
    while (true) {
        await collect(MUSIC_PATH)
        await new Promise(resolve => setTimeout(resolve, 30000))
    }
}

export = doWork