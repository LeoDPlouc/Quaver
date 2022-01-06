import { Request, Response, NextFunction } from "express"
import { Document } from "mongoose"
import { Album } from "../models/albumModel"

import { Artist, IArtist } from "../models/artistModel"
import { Song } from "../models/songModel"
import { cleanManyAlbums } from "./albumController"
import { cleanManySongs } from "./songController"

export function cleanOneArtist(data: IArtist & Document<any, any, IArtist>): any {
    var cleanedData = {
        id: data._id,
        name: data.name,
        cover: data.cover
    }
    return cleanedData
}

export function cleanManyArtists(datas: (IArtist & Document<any, any, IArtist>)[]): any[] {
    var cleaned = []
    datas.forEach((data, i) => cleaned.push(cleanOneArtist(data)))
    return cleaned
}

export async function getAllArtists(req: Request, res: Response, next: NextFunction) {
    try {
        const artists = cleanManyArtists(await Artist.find())

        res.json({
            status: "succes",
            results: artists.length,
            data: {
                artists
            }
        })

    } catch (e) {
        res.json({
            status: "fail"
        })
    }
}

export async function getOneArtist(req: Request, res: Response, next: NextFunction) {
    try {
        const artist = cleanOneArtist(await Artist.findById(req.params.id))

        res.json({
            status: "succes",
            data: {
                artist
            }
        })

    } catch (e) {
        res.json({
            status: "fail"
        })
    }
}

export async function updateArtist(req: Request, res: Response, next: NextFunction) {
    try {
        const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.json({
            status: "succes",
            data: {
                artist
            }
        })

    } catch (e) {
        res.json({
            status: "fail"
        })
    }
}

export async function getArtistSongs(req: Request, res: Response, next: NextFunction) {
    try {
        const songs = await Song.find({ artistId: req.params.id })
        const cleanedSongs = cleanManySongs(songs)

        res.json({
            status: "succes",
            data: {
                songs: cleanedSongs
            }
        })
    }
    catch {
        res.json({
            status: "fail"
        })
    }
}

export async function getArtistAlbums(req: Request, res: Response, next: NextFunction) {
    try {
        const albums = await Album.find({ artistId: req.params.id })
        const cleanedAlbums = cleanManyAlbums(albums)

        res.json({
            status: "succes",
            data: {
                albums: cleanedAlbums
            }
        })
    }
    catch {
        res.json({
            status: "fail"
        })
    }
}