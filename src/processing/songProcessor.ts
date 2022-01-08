import { parseFile } from "music-metadata"
import { Document } from "mongoose"
import Path from "path"
import fpcalc from "fpcalc"
import { promisify } from "util"

import { Album, IAlbum } from "../models/albumModel"
import { Artist, IArtist } from "../models/artistModel"
import { ISong } from "../models/songModel"
import { FPCALC_PATH } from "../config/config"

async function getAcoustid(songPath: string): Promise<string> {
    const fp = promisify(fpcalc)
    var fingerprint

    //If fpcalc isn't in PATH, use fpcalc with its path
    if (FPCALC_PATH) fingerprint = await fp(songPath, { command: FPCALC_PATH })
    else fingerprint = await fp(songPath)

    return fingerprint.fingerprint as string

}

export async function getMetadata(songPath: string): Promise<ISong> {
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

        console.log(`Found new album ${album.title}`)
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

        console.log(`Found new artist ${artist.name}`)
    }

    return artist
}