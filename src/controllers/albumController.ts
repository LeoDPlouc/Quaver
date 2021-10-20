import { Request, Response, NextFunction } from "express"

import { Album } from "../models/albumModel"

async function getAllAlbums(req: Request, res: Response, next: NextFunction) {
    try {
        const albums = await Album.find()

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
        const album = await Album.findById(req.params.id)

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