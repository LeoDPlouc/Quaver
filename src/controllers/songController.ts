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

import { Request, Response, } from "express"
import { validationResult } from "express-validator"
import { getAllSongs, getSong, updateSong } from "../service/songService"
import { mapSongDTO } from "../mappers/songMapper"
import { logError } from "../utils/logger"

export async function getAllSongsInfoCtrl(req: Request, res: Response) {
    let result = await getAllSongs()

    if (result.failure) {
        logError(result.failure)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
        return
    }
    //Search all songs in the db and clean the output
    const songs = result.result.map(s => mapSongDTO(s))

    res.json({
        status: "success",
        statusCode: 0,
        results: songs.length,
        data: {
            songs
        }
    })
}

export async function getOneSongInfoCtrl(req: Request, res: Response) {
    let err = validationResult(req)
    if (!err.isEmpty()) {
        res.json({
            status: "fail",
            statusCode: 2,
            errorMessage: "Invalid request"
        })
        return
    }

    let result = await getSong(req.params.id)

    if (result.failure) {
        logError(result.failure)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
        return
    }
    //Search a song by id and clean the output
    const song = mapSongDTO(result.result)

    res.json({
        status: "success",
        statusCode: 0,
        data: {
            song
        }
    })
}

export async function getSongStreamCtrl(req: Request, res: Response) {
    let err = validationResult(req)
    if (!err.isEmpty()) {
        res.json({
            status: "fail",
            statusCode: 2,
            errorMessage: "Invalid request"
        })
        return
    }

    let result = await getSong(req.params.id)

    if (result.failure) {
        logError(result.failure)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
        return
    }
    //Search a song by id and and send the file
    const song = result.result

    res.sendFile(song.path)
}

export async function updateLikeCtrl(req: Request, res: Response) {
    let err = validationResult(req)
    if (!err.isEmpty()) {
        res.json({
            status: "fail",
            statusCode: 2,
            errorMessage: "Invalid request"
        })
        return
    }

    let result = await getSong(req.params.id)

    if (result.failure) {
        logError(result.failure)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
        return
    }
    //Search a song by id
    const song = result.result

    //Update the like field
    song.like = Number(req.body.like)
    updateSong(song)

    res.json({
        status: "success",
        statusCode: 0,
    })
}