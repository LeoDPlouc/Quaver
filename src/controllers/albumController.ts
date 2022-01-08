import { Request, Response, NextFunction } from "express"
import { Document } from "mongoose"

import { Album, IAlbum } from "../models/albumModel"
import { Song } from "../models/songModel"
import { cleanManySongs } from "./songController"

export function cleanOneAlbum(data: IAlbum & Document<any, any, IAlbum>): any {
    var cleanedData = {
        id: data._id,
        title: data.title,
        artist: data.artist,
        artistId: data.artistId,
        year: data.year
    }
    return cleanedData
}

export function cleanManyAlbums(datas: (IAlbum & Document<any, any, IAlbum>)[]): any[] {
    var cleaned = []
    datas.forEach((data, i) => cleaned.push(cleanOneAlbum(data)))
    return cleaned
}

async function getAllAlbums(req: Request, res: Response, next: NextFunction) {
    try {
        //Search all albums in the db and clean the output
        const albums = cleanManyAlbums(await Album.find())

        res.json({
            status: "succes",
            results: albums.length,
            data: {
                albums
            }
        })

    } catch (e) {
        console.debug(e)
        res.json({
            status: "fail"
        })
    }
}

async function getOneAlbum(req: Request, res: Response, next: NextFunction) {
    try {
        //Search an album by id and clean the output
        const album = cleanOneAlbum(await Album.findById(req.params.id))

        res.json({
            status: "succes",
            data: {
                album
            }
        })

    } catch (e) {
        res.json({
            status: "fail"
        })
    }
}

async function updateAlbum(req: Request, res: Response, next: NextFunction) {
    try {
        const album = await Album.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.json({
            status: "succes",
            data: {
                album
            }
        })

    } catch (e) {
        res.json({
            status: "fail"
        })
    }
}

export async function getAlbumSongs(req: Request, res: Response, next: NextFunction) {
    try {
        //Search songs by albumid in the db and clean the output
        const songs = await Song.find({ albumId: req.params.id })
        var cleanedSongs = cleanManySongs(songs)

        res.json({
            status: "succes",
            results: cleanedSongs.length,
            data: {
                songs: cleanedSongs
            }
        })
    } catch {
        res.json({
            status: "fail"
        })
    }
}

export { getAllAlbums, getOneAlbum, updateAlbum }