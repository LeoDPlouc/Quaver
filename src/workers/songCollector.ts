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
import logger from "../utils/logger"
import { createSong, findSongByPath } from "../service/songService"
import { getMetadataFromFile } from "../access/file/songFile"
import { createAlbum, findAlbumByName } from "../service/albumService"
import { createArtist, findArtistByName } from "../service/artistService"

async function collect(libPath: string) {
    var paths = await fs.readdir(libPath, { withFileTypes: true }).catch()
    for (var i = 0; i < paths.length; i++) {
        var fullPath = path.join(libPath, paths[i].name)

        if (paths[i].isDirectory())
            await collect(fullPath)

        if (paths[i].isFile())
            await registerSong(path.resolve(fullPath))
    }
}

async function registerSong(songPath: string) {
    //try {
        //Only considere audio files
        if (!(mm.lookup(path.extname(songPath)) as string).match("audio")) return

        //If the song doesn't already exist, extract its metadata and create a new song
        if (await findSongByPath(songPath)) return

        var song = await getMetadataFromFile(songPath)

        logger.info(`Found new song ${song.path}`)

        //Fetch the song's album
        var album = (await findAlbumByName(song.album, song.artist))[0]
        if (!album) album = { artist: song.artist, title: song.album, year: song.year }

        //Fetch the song's artist
        var artist = (await findArtistByName(song.artist))[0]
        if (!artist) artist = { name: song.artist }

        const artistId = await createArtist(artist)

        album.artistId = artistId
        const albumId = await createAlbum(album)

        song.artistId = artistId
        song.albumId = albumId
        await createSong(song)
    //} catch (err) {
    //    logger.error(err)
    //}
}


function doWork() {

    logger.info("Song collection Started")

    connectToDb().then(async () => {

        //Collection run in background and is relaunched every 30 sec
        while (true) {
            await collect(MUSIC_PATH)
            await new Promise(resolve => setTimeout(resolve, 30000))
        }
    })
}

doWork()