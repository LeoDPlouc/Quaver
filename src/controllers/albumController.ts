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
import { getAlbum, getAlbumSongs, getAllAlbums } from "../service/albumService"
import { mapAlbumDTO } from "../mappers/albumMapper"
import { mapSongDTO } from "../mappers/songMapper"

export async function getAllAlbumsCtrl(req: Request, res: Response) {
    try {
        //Search all albums in the db and clean the output
        const albums = (await getAllAlbums()).map(a => mapAlbumDTO(a))

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

export async function getAlbumCtrl(req: Request, res: Response) {
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
        const album = mapAlbumDTO(await getAlbum(req.body.id))

        res.json({
            status: "success",
            statusCode: 0,
            data: {
                album
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

export async function getAlbumSongsCtrl(req: Request, res: Response) {
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
        const songs = (await getAlbumSongs(req.params.id)).map(s => mapSongDTO(s))

        res.json({
            status: "success",
            results: songs.length,
            statusCode: 0,
            data: {
                songs: songs
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