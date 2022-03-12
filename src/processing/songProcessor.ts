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

import { parseFile } from "music-metadata"
import { ClientSession, Document, startSession } from "mongoose"
import Path from "path"
import fp from "fpcalc-async"
import { Album, IAlbum } from "../access/database/models/albumModel"
import { Artist, IArtist } from "../access/database/models/artistModel"
import { ISong } from "../access/database/models/songModel"
import { FPCALC_PATH } from "../config/config"
import { getAlbumCover, getAlbumMBId } from "./albumProcessor"
import { FpcalcResult } from "fpcalc"
import logger from "../utils/logger"

export async function getAcoustid(songPath: string): Promise<string> {
    var fingerprint: FpcalcResult<string>

    //If fpcalc isn't in PATH, use fpcalc with its path
    if (FPCALC_PATH) fingerprint = await fp(songPath, { command: FPCALC_PATH })
    else fingerprint = await fp(songPath)

    return fingerprint.fingerprint as string

}

export async function getMetadataFromFile(songPath: string): Promise<ISong> {
    var tag = await parseFile(songPath)

    var format = Path.extname(songPath)
    var fp = await getAcoustid(songPath)

    const song: ISong = {
        title: tag.common.title,
        n: tag.common.track.no,
        artist: tag.common.albumartist,
        album: tag.common.album,
        year: tag.common.year,
        duration: tag.format.duration,
        like: 0,
        path: songPath,
        format: format,
        acoustid: fp
    }

    return song
}

export async function getAlbum(song: ISong): Promise<IAlbum & Document<any, any, IAlbum>> {
    var album: IAlbum & Document<any, any, IAlbum> = null

    //If the artist doesn't already exist, creates it
    if (song.albumId)
        album = await Album.findById(song.albumId)
    else
        album = await Album.findOne({ title: song.album, artist: song.artist })

    if (!album) {
        album = new Album({
            title: song.album,
            artist: song.artist,
            year: song.year
        })

        logger.info(`Found new album ${album.id}`)

        //Fetch album's MBId
        var albumMbId = await getAlbumMBId(album)
        album.mbids = albumMbId

        //Fetch album's cover
        var albumCover = await getAlbumCover(album)
        if (albumCover) {
            album.cover = albumCover.id
        } else logger.info(`No cover found ${album.id}`)

        await album.save()
    }
    return album
}

export async function getArtist(song: ISong): Promise<IArtist & Document<any, any, IArtist>> {

    var artist: IArtist & Document<any, any, IArtist> = null

    //If the artist doesn't already exist, creates it
    if (song.artistId)
        artist = await Artist.findById(song.artistId)
    else
        artist = await Artist.findOne({ name: song.artist })

    if (!artist) {
        artist = new Artist({
            name: song.artist
        })

        logger.info(`Found new artist ${artist.id}`)

        await artist.save()
    }

    return artist
}