// Quaver is a self-hostable music player and music library manager
// Copyright (C) 2022  DPlouc
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Request, Response, NextFunction } from "express"
import { Document } from "mongoose"
import { Image, IImage } from "../models/imageModel"
import logger from "../utils/logger"

//Clean api output
export function cleanOneImage(data: IImage & Document<any, any, IImage>): any {
    var cleanedData = {
        id: data._id
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
        //Search all images in the db and clean the output
        const images = cleanManyImages(await Image.find())

        res.json({
            status: "succes",
            results: images.length,
            data: {
                images
            }
        })

    } catch (e) {
        logger.crit(e)
        res.json({
            status: "fail"
        })
    }
}

export async function getOneImageInfo(req: Request, res: Response, next: NextFunction) {
    try {
        //Search an image by id and clean the output
        const image = cleanOneImage(await Image.findById(req.params.id))

        res.json({
            status: "succes",
            data: {
                image
            }
        })

    } catch (e) {
        logger.crit(e)
        res.json({
            status: "fail"
        })
    }
}

export async function getImage(req: Request, res: Response, next: NextFunction) {
    try {
        //Search an image by id and send the file
        const image = await Image.findById(req.params.id)

        res.sendFile(image.path)

    } catch (e) {
        logger.error(e)
        res.json({
            status: "fail"
        })
    }
}