import { Request, Response, NextFunction } from "express"

import { Song } from "../models/songModel"

export async function getAllSongs(req: Request, res: Response, next: NextFunction) {
    try {
        const songs = await Song.find()

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
        const song = await Song.findById(req.params.id)

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