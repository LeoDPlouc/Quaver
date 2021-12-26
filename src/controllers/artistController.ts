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
        const artist = cleanOne(await Artist.findById(req.params.id))

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