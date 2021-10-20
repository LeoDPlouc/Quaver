import { Request, Response, NextFunction } from "express"
import { Document } from "mongoose"

import { Album, IAlbum } from "../models/albumModel"

function cleanOne(data: IAlbum & Document<any, any, IAlbum>): any {
    var cleanedData = {
        id: data._id,
        title: data.title,
        artist: data.artist,
        artistId: data.artistId
    }
    return cleanedData
}

function cleanMany(datas: (IAlbum & Document<any, any, IAlbum>)[]): any[] {
    var cleaned = []
    datas.forEach((data, i) => cleaned.push(cleanOne(data)))
    return cleaned
}

async function getAllAlbums(req: Request, res: Response, next: NextFunction) {
    try {
        const albums = cleanMany(await Album.find())

        res.status(200).json({
            status: "succes",
            results: albums.length,
            data: {
                albums
            }
        })

    } catch (e) {
        console.debug(e)
        res.status(400).json({
            status: "fail"
        })
    }
}

async function getOneAlbum(req: Request, res: Response, next: NextFunction) {
    try {
        const album = cleanOne(await Album.findById(req.params.id))

        res.status(200).json({
            status: "succes",
            data: {
                album
            }
        })

    } catch (e) {
        res.status(400).json({
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

        res.status(200).json({
            status: "succes",
            data: {
                album
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

export { getAllAlbums, getOneAlbum, updateAlbum }