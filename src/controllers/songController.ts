import { Request, Response, NextFunction } from "express"
import { Document } from "mongoose"

import { ISong, Song } from "../models/songModel"

function cleanOne(data: ISong & Document<any, any, ISong>): any {
    var cleanedData = {
        id: data._id,
        title: data.title,
        n: data.n,
        artist: data.artist,
        album: data.album,
        year: data.year,
        duration: data.duration,
        like: data.like,
        albumId: data.albumId,
        artistId: data.artistId
    }
    return cleanedData
}

function cleanMany(datas: (ISong & Document<any, any, ISong>)[]): any[] {
    var cleaned = []
    datas.forEach((data, i) => cleaned.push(cleanOne(data)))
    return cleaned
}

export async function getAllSongs(req: Request, res: Response, next: NextFunction) {
    try {
        const songs = cleanMany(await Song.find())

        res.status(200).json({
            status: "succes",
            results: songs.length,
            data: {
                songs
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

export async function getOneSong(req: Request, res: Response, next: NextFunction) {
    try {
        const song = cleanOne(await Song.findById(req.params.id))

        res.status(200).json({
            status: "succes",
            data: {
                song
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

export async function updateSong(req: Request, res: Response, next: NextFunction) {
    try {
        const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.status(200).json({
            status: "succes",
            data: {
                song
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}