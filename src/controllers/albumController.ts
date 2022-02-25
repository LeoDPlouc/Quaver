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
import { Album, IAlbum } from "../models/albumModel"
import { Song } from "../models/songModel"
import logger from "../utils/logger"
import { cleanManySongs } from "./songController"
import { validationResult } from "express-validator"

//Clean api output
export function cleanOneAlbum(data: IAlbum & Document<any, any, IAlbum>): any {
    var cleanedData = {
        id: data._id,
        title: data.title,
        artist: data.artist,
        artistId: data.artistId,
        year: data.year,
        cover: data.cover
    }
    return cleanedData
}

export function cleanManyAlbums(datas: (IAlbum & Document<any, any, IAlbum>)[]): any[] {
    var cleaned = []
    datas.forEach((data, i) => cleaned.push(cleanOneAlbum(data)))
    return cleaned
}

export async function getAllAlbums(req: Request, res: Response, next: NextFunction) {
    try {
        //Search all albums in the db and clean the output
        const albums = cleanManyAlbums(await Album.find())

        res.json({
            status: "success",
            statusCode: 0,
            results: albums.length,
            data: {
                albums
            }
        })

    } catch (e) {
        logger.crit(e)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
    }
}

export async function getOneAlbum(req: Request, res: Response, next: NextFunction) {
    var err = validationResult(req)
    if (!err.isEmpty()) {
        return res.json({
            status: "fail",
            statusCode: 2,
            errorMessage: "Invalid request"
        })
    }

    try {
        //Search an album by id and clean the output
        const album = cleanOneAlbum(await Album.findById(req.params.id))

        res.json({
            status: "success",
            statusCode: 0,
            data: {
                album
            }
        })

    } catch (e) {
        logger.crit(e)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
    }
}

export async function updateAlbum(req: Request, res: Response, next: NextFunction) {
    var err = validationResult(req)
    if (!err.isEmpty()) {
        return res.json({
            status: "fail",
            statusCode: 2,
            errorMessage: "Invalid request"
        })
    }

    try {
        const album = await Album.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.json({
            status: "succes",
            statusCode: 0,
            data: {
                album
            }
        })

    } catch (e) {
        logger.crit(e)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
    }
}

export async function getAlbumSongs(req: Request, res: Response, next: NextFunction) {
    var err = validationResult(req)
    if (!err.isEmpty()) {
        return res.json({
            status: "fail",
            statusCode: 2,
            errorMessage: "Invalid request"
        })
    }

    try {
        //Search songs by albumid in the db and clean the output
        const songs = await Song.find({ albumId: req.params.id })
        var cleanedSongs = cleanManySongs(songs)

        res.json({
            status: "success",
            results: cleanedSongs.length,
            statusCode: 0,
            data: {
                songs: cleanedSongs
            }
        })
    } catch (e) {
        logger.crit(e)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
    }
}