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
import { validationResult } from "express-validator"
import { getAllImages, getImage } from "../service/imageService"
import { mapImageDTO } from "../mappers/imageMapper"
import { logError } from "../utils/logger"

export async function getAllImagesInfoCtrl(req: Request, res: Response) {
    let result = await getAllImages()

    if (result.failure) {
        logError(result.failure)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
        return
    }
    //Search all images in the db and clean the output
    const images = result.result.map(i => mapImageDTO(i))

    res.json({
        status: "success",
        statusCode: 0,
        results: images.length,
        data: {
            images
        }
    })
}

export async function getOneImageInfoCtrl(req: Request, res: Response) {
    let err = validationResult(req)
    if (!err.isEmpty()) {
        res.json({
            status: "fail",
            statusCode: 2,
            errorMessage: "Invalid request"
        })
        return
    }

    let result = await getImage(req.params.id)

    if (result.failure) {
        logError(result.failure)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
    }
    //Search an image by id and clean the output
    const image = mapImageDTO(result.result)

    res.json({
        status: "success",
        statusCode: 0,
        data: {
            image
        }
    })
}

export async function getImageFileCtrl(req: Request, res: Response) {
    let err = validationResult(req)
    if (!err.isEmpty()) {
        res.json({
            status: "fail",
            statusCode: 2,
            errorMessage: "Invalid request"
        })
        return
    }

    let result = await getImage(req.params.id)

    if (result.failure) {
        logError(result.failure)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
        return
    }
    //Search an image by id and send the file
    const image = result.result

    res.sendFile(image.path)
}