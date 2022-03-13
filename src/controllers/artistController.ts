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
import { getAllArtists, getArtist, getArtistAlbums, getArtistSongs } from "../service/artistService"
import { mapArtistDTO } from "../mappers/artistMapper"
import { mapSongDTO } from "../mappers/songMapper"
import { mapAlbumDTO } from "../mappers/albumMapper"

export async function getAllArtistsCtrl(req: Request, res: Response) {
    try {
        //Search all artists in the db and clean the output
        const artists = (await getAllArtists()).map(a => mapArtistDTO(a))

        res.json({
            status: "success",
            statusCode: 0,
            results: artists.length,
            data: {
                artists
            }
        })

    } catch (e) {
        logger.error(e)
        res.json({
            statusCode: 1,
            errorMessage: "Server error",
            status: "fail"
        })
    }
}

export async function getOneArtistCtrl(req: Request, res: Response) {
    var err = validationResult(req)
    if (!err.isEmpty()) {
        return res.json({
            status: "fail",
            statusCode: 2,
            errorMessage: "Invalid request"
        })
    }

    try {
        //Search an artist by id and clean the output
        const artist = mapArtistDTO(await getArtist(req.params.id))

        res.json({
            status: "success",
            statusCode: 0,
            data: {
                artist
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

export async function getArtistSongsCtrl(req: Request, res: Response) {
    var err = validationResult(req)
    if (!err.isEmpty()) {
        return res.json({
            status: "fail",
            statusCode: 2,
            errorMessage: "Invalid request"
        })
    }

    try {
        //Search songs by artistId and clean the output
        const songs = (await getArtistSongs(req.params.id)).map(s => mapSongDTO(s))

        res.json({
            status: "success",
            statusCode: 0,
            results: songs.length,
            data: {
                songs: songs
            }
        })
    }
    catch (e) {
        logger.error(e)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
    }
}

export async function getArtistAlbumsCtrl(req: Request, res: Response) {
    var err = validationResult(req)
    if (!err.isEmpty()) {
        return res.json({
            status: "fail",
            statusCode: 2,
            errorMessage: "Invalid request"
        })
    }

    try {
        //Search albums by artistId and clean the output
        const albums = (await getArtistAlbums(req.params.id)).map(a => mapAlbumDTO(a))

        res.json({
            status: "success",
            statusCode: 0,
            results: albums.length,
            data: {
                albums: albums
            }
        })
    }
    catch (e) {
        logger.error(e)
        res.json({
            status: "fail",
            statusCode: 1,
            errorMessage: "Server error"
        })
    }
}