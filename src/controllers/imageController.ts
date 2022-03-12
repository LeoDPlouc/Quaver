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

import { Request, Response } from "express"
import logger from "../utils/logger"
import { validationResult } from "express-validator"
import { getAllImages, getImage } from "../service/imageService"
import { mapImageDTO } from "../mappers/imageMapper"

export async function getAllImagesInfoCtrl(req: Request, res: Response) {
    try {
        //Search all images in the db and clean the output
        const images = (await getAllImages()).map(i => mapImageDTO(i))

        res.json({
            status: "success",
            statusCode: 0,
            results: images.length,
            data: {
                images
            }
        })

    } catch (e) {
        logger.error(e)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
    }
}

export async function getOneImageInfoCtrl(req: Request, res: Response) {
    var err = validationResult(req)
    if (!err.isEmpty()) {
        return res.json({
            status: "fail",
            statusCode: 2,
            errorMessage: "Invalid request"
        })
    }

    try {
        //Search an image by id and clean the output
        const image = mapImageDTO(await getImage(req.body.id))

        res.json({
            status: "success",
            statusCode: 0,
            data: {
                image
            }
        })

    } catch (e) {
        logger.error(e)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
    }
}

export async function getImageFileCtrl(req: Request, res: Response) {
    var err = validationResult(req)
    if (!err.isEmpty()) {
        return res.json({
            status: "fail",
            statusCode: 2,
            errorMessage: "Invalid request"
        })
    }

    try {
        //Search an image by id and send the file
        const image = await getImage(req.body.id)

        res.sendFile(image.path)

    } catch (e) {
        logger.error(e)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
    }
}