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

import { getAlbum, getArtist, getMetadataFromFile } from "../processing/songProcessor"
import { Song } from "../access/database/models/songModel"
import { MUSIC_PATH } from "../config/config"
import logger from "../utils/logger"
import { waitForDb } from "../access/database/migration/initdb"

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
    try {
        //Only considere audio files
        if (!(mm.lookup(path.extname(songPath)) as string).match("audio"))
            return

        var song = await Song.findOne({ path: songPath })

        //If the song doesn't already exist, extract its metadata and create a new song
        if (song)
            return

        const songInfo = await getMetadataFromFile(songPath)

        song = new Song(songInfo)
        await song.save().then(() => logger.info(`Found new song ${song.id}`))

        //Fetch the song's album
        var album = await getAlbum(song)

        //Save the albumId in the song
        song.albumId = album.id
        await song.save()

        //Fetch the song's artist
        var artist = await getArtist(song)

        //Save the artistId in the song
        song.artistId = artist.id
        await song.save()

        //Save the artistid in the album
        album.artistId = artist.id
        await album.save()
    } catch (err) {
        logger.error(err)
    }
}


function doWork() {

    logger.info("Song collection Started")

    waitForDb().then(async () => {

        //Collection run in background and is relaunched every 30 sec
        while (true) {
            await collect(MUSIC_PATH)
            await new Promise(resolve => setTimeout(resolve, 30000))
        }
    })
}

doWork()