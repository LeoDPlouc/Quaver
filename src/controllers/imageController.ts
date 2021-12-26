import { Request, Response, NextFunction } from "express"
import { Document } from "mongoose"

import { Image, IImage } from "../models/imageModel"

function cleanOne(data: IImage & Document<any, any, IImage>): any {
    var cleanedData = {
        id: data._id,
        resolution: data.resolution,
        type: data.type
    }
    return cleanedData
}

function cleanMany(datas: (IImage & Document<any, any, IImage>)[]): any[] {
    var cleaned = []
    datas.forEach((data, i) => cleaned.push(cleanOne(data)))
    return cleaned
}

export async function getAllImagesInfo(req: Request, res: Response, next: NextFunction) {
    try {
        const images = cleanMany(await Image.find())

        res.status(200).json({
            status: "succes",
            results: images.length,
            data: {
                images
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

export async function getOneImageInfo(req: Request, res: Response, next: NextFunction) {
    try {
        const image = cleanOne(await Image.findById(req.params.id))

        res.status(200).json({
            status: "succes",
            data: {
                image
            }
        })

    } catch (e) {
        res.status(400).json({
            status: "fail"
        })
    }
}

export async function getImage(req: Request, res: Response, next: NextFunction) {
    try {
        const image = await Image.findById(req.params.id)

        res.sendFile(image.path)

    } catch (e) {
        res.json({
            status: "fail"
        })
    }
}