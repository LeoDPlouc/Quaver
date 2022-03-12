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
import logger from "../utils/logger"
import { validationResult } from "express-validator"
import { getAllSongs, getSong, updateSong } from "../service/songService"
import { mapSongDTO } from "../mappers/songMapper"

export async function getAllSongsInfoCtrl(req: Request, res: Response) {
    try {
        //Search all songs in the db and clean the output
        const songs = (await getAllSongs()).map(s => mapSongDTO(s))

        res.json({
            status: "success",
            statusCode: 0,
            results: songs.length,
            data: {
                songs
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

export async function getOneSongInfoCtrl(req: Request, res: Response) {
    var err = validationResult(req)
    if (!err.isEmpty()) {
        return res.json({
            status: "fail",
            statusCode: 2,
            errorMessage: "Invalid request"
        })
    }

    try {
        //Search a song by id and clean the output
        const song = mapSongDTO(await getSong(req.body.id))

        res.json({
            status: "success",
            statusCode: 0,
            data: {
                song
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

export async function getSongStreamCtrl(req: Request, res: Response) {
    var err = validationResult(req)
    if (!err.isEmpty()) {
        return res.json({
            status: "fail",
            statusCode: 2,
            errorMessage: "Invalid request"
        })
    }

    try {
        //Search a song by id and and send the file
        const song = await getSong(req.params.id)

        res.sendFile(song.path)

    } catch (e) {
        console.error(e)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
    }
}

export async function updateLikeCtrl(req: Request, res: Response) {
    var err = validationResult(req)
    if (!err.isEmpty()) {
        return res.json({
            status: "fail",
            statusCode: 2,
            errorMessage: "Invalid request"
        })
    }

    try {
        //Search a song by id
        const song = await getSong(req.params.id)

        //Update the like field
        song.like = Number(req.body.like)
        updateSong(song)

        res.json({
            status: "success",
            statusCode: 0,
        })
    }
    catch (e) {
        console.log(e)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
    }
}