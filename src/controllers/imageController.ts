import { Request, Response, NextFunction } from "express"
import { Document } from "mongoose"

import { Image, IImage } from "../models/imageModel"

export function cleanOneImage(data: IImage & Document<any, any, IImage>): any {
    var cleanedData = {
        id: data._id,
        resolution: data.resolution,
    }
    return cleanedData
}

export function cleanManyImages(datas: (IImage & Document<any, any, IImage>)[]): any[] {
    var cleaned = []
    datas.forEach((data, i) => cleaned.push(cleanOneImage(data)))
    return cleaned
}

export async function getAllImagesInfo(req: Request, res: Response, next: NextFunction) {
    try {
        const images = cleanManyImages(await Image.find())

        res.json({
            status: "succes",
            results: images.length,
            data: {
                images
            }
        })

    } catch (e) {
        res.json({
            status: "fail"
        })
    }
}

export async function getOneImageInfo(req: Request, res: Response, next: NextFunction) {
    try {
        const image = cleanOneImage(await Image.findById(req.params.id))

        res.json({
            status: "succes",
            data: {
                image
            }
        })

    } catch (e) {
        res.json({
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