import { Request, Response, NextFunction } from "express"
import { Document } from "mongoose"

import { Artist, IArtist } from "../models/artistModel"

function cleanOne(data: IArtist & Document<any, any, IArtist>): any {
    var cleanedData = {
        id: data._id,
        name: data.name
    }
    return cleanedData
}

function cleanMany(datas: (IArtist & Document<any, any, IArtist>)[]): any[] {
    var cleaned = []
    datas.forEach((data, i) => cleaned.push(cleanOne(data)))
    return cleaned
}

export async function getAllArtists(req: Request, res: Response, next: NextFunction) {
    try {
        const artists = cleanMany(await Artist.find())

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
        const artist = cleanOne(await Artist.findById(req.params.id))

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