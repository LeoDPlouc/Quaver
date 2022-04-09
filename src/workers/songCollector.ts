// Quaver is a self-hostable music player and music library manager
// Copyright (C) 2022  DPlouc
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import fs from "fs/promises"
import path from "path"
import mm from "mime-types"
import { MUSIC_PATH } from "../config/config"
import { connectToDb } from "../access/database/utils"
import { createSong, findSongByPath, updateSong } from "../service/songService"
import { getMetadataFromFile } from "../access/file/songFile"
import { createAlbum, findAlbumByName, updateAlbum } from "../service/albumService"
import { createArtist, findArtistByName } from "../service/artistService"
import { Failure } from "../utils/Failable"
import { logError, logInfo, setWorkerName } from "../utils/logger"

async function collect(libPath: string) {
    try {
        var paths = await fs.readdir(libPath, { withFileTypes: true })
    } catch (err) {
        let failure: Failure = {
            file: __filename,
            func: collect.name,
            msg: err
        }
    }

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
    if (!(mm.lookup(path.extname(songPath)) as string).match("audio")) return

    //If the song doesn't already exist, extract its metadata and create a new song
    if ((await findSongByPath(songPath)).result) return

    let metadataResult = await getMetadataFromFile(songPath)
    if (metadataResult.failure) {
        logError(metadataResult.failure)
        return
    }
    let song = metadataResult.result

    logInfo(`Found new song ${song.path}`)

    //Fetch the song's album
    let albumResult = await findAlbumByName(song.album, song.artist)
    if (albumResult.failure) {
        logError(albumResult.failure)
        return
    }
    let album = albumResult.result[0]

    let albumId
    if (!album) {
        album = { artist: song.artist, title: song.album, year: song.year }

        let albumIdResult = await createAlbum(album)
        if (albumIdResult.failure) {
            logError(albumIdResult.failure)
            return
        }
        albumId = albumIdResult.result

        logInfo(`Found new album ${album.title}`)
    }

    //Fetch the song's artist
    let artistResult = await findArtistByName(song.artist)
    if (artistResult.failure) {
        logError(artistResult.failure)
        return
    }
    let artist = artistResult.result[0]

    let artistId
    if (!artist) {
        artist = { name: song.artist }

        let artistIdResult = await createArtist(artist)
        if (artistIdResult.failure) {
            logError(artistIdResult.failure)
            return
        }
        artistId = artistIdResult.result

        logInfo(`Found new artist ${artist.name}`)
    }


    album.artistId = artistId
    await updateAlbum(album)

    song.artistId = artistId
    song.albumId = albumId
    await createSong(song)
}


function doWork() {
    setWorkerName("SongCollector")
    logInfo("Song collection Started")

    connectToDb().then(async () => {

        //Collection run in background and is relaunched every 30 sec
        while (true) {
            await collect(MUSIC_PATH)
            await new Promise(resolve => setTimeout(resolve, 30000))
        }
    })
}

doWork()