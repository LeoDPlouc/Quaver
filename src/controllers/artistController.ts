import { Request, Response, NextFunction } from "express"

import { Artist } from "../models/artistModel"

export async function getAllArtists(req: Request, res: Response, next: NextFunction) {
    try {
        const artists = await Artist.find()

        res.status(200).json({
            status: "succes",
            results: artists.length,
            data: {
                artists
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

export async function getOneArtist(req: Request, res: Response, next: NextFunction) {
    try {
        const artist = await Artist.findById(req.params.id)

        res.status(200).json({
            status: "succes",
            data: {
                artist
            }
        })

    } catch (e) {
        res.status(400).json({
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

        res.status(200).json({
            status: "succes",
            data: {
                artist
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}