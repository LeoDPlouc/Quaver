import { Request, Response, NextFunction } from "express"
import { Document } from "mongoose"

import { ISong, Song } from "../models/songModel"

export function cleanOneSong(data: ISong & Document<any, any, ISong>): any {
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
        artistId: data.artistId,
        format: data.format
    }
    return cleanedData
}

export function cleanManySongs(datas: (ISong & Document<any, any, ISong>)[]): any[] {
    var cleaned = []
    datas.forEach((data, i) => cleaned.push(cleanOneSong(data)))
    return cleaned
}

export async function getAllSongsInfo(req: Request, res: Response, next: NextFunction) {
    try {
        const songs = cleanManySongs(await Song.find())

        res.json({
            status: "succes",
            results: songs.length,
            data: {
                songs
            }
        })

    } catch (e) {
        res.json({
            status: "fail"
        })
    }
}

export async function getOneSongInfo(req: Request, res: Response, next: NextFunction) {
    try {
        const song = cleanOneSong(await Song.findById(req.params.id))

        res.json({
            status: "succes",
            data: {
                song
            }
        })

    } catch (e) {
        res.json({
            status: "fail"
        })
    }
}

export async function updateSongInfo(req: Request, res: Response, next: NextFunction) {
    try {
        const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.json({
            status: "succes",
            data: {
                song
            }
        })

    } catch (e) {
        res.json({
            status: "fail"
        })
    }
}

export async function getSongStream(req: Request, res: Response, next: NextFunction) {
    try {
        const song = await Song.findById(req.params.id)

        res.sendFile(song.path)

    } catch (e) {
        res.json({
            status: "fail"
        })
    }
}

export async function updateLike(req: Request, res: Response, next: NextFunction) {
    try {
        const song = await Song.findById(req.params.id)

        song.like = Number(req.body.like)
        await song.save()

        res.json({
            status: "succes"
        })
    }
    catch (e) {
        console.log(e)
        res.json({
            status: "fail"
        })
    }
}