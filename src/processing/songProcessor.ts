import { IAudioMetadata, parseFile } from "music-metadata"
import { Document } from "mongoose"
import Path from "path"

import { Album, IAlbum } from "../models/albumModel"
import { Artist, IArtist } from "../models/artistModel"
import { ISong } from "../models/songModel"

async function getMetadata(songPath: string): Promise<ISong> {
    var tag = await parseFile(songPath)

    var format = Path.extname(songPath)

    const song: ISong = {
        title: tag.common.title,
        n: tag.common.track.no,
        artist: tag.common.albumartist,
        album: tag.common.album,
        year: tag.common.year,
        duration: tag.format.duration,
        like: 0,
        path: songPath,
        format: format
    }

    return song
}

async function getAlbum(song: ISong): Promise<IAlbum & Document<any, any, IAlbum>> {
    var album: IAlbum & Document<any, any, IAlbum> = null

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

async function getArtist(song: ISong): Promise<IArtist & Document<any, any, IArtist>> {
    var artist: IArtist & Document<any, any, IArtist> = null
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

export { getArtist, getAlbum, getMetadata }