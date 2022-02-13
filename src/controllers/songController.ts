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
import { ISong, Song } from "../models/songModel"
import logger from "../utils/logger"

//Clean api output
export function cleanOneSong(data: ISong & Document<any, any, ISong>): any {
    var cleanedData = {
        id: data._id,
        title: data.title,
        n: data.n,
        artist: data.artist,
        album: data.album,
        year: data.year,
        duration: data.duration,
        like: data.like,
        albumId: data.albumId,
        artistId: data.artistId,
        format: data.format
    }
    return cleanedData
}

export function cleanManySongs(datas: (ISong & Document<any, any, ISong>)[]): any[] {
    var cleaned = []
    datas.forEach((data, i) => cleaned.push(cleanOneSong(data)))
    return cleaned
}

export async function getAllSongsInfo(req: Request, res: Response, next: NextFunction) {
    try {
        //Search all songs in the db and clean the output
        const songs = cleanManySongs(await Song.find())

        res.json({
            status: "succes",
            results: songs.length,
            data: {
                songs
            }
        })

    } catch (e) {
        logger.crit(e)
        res.json({
            status: "fail"
        })
    }
}

export async function getOneSongInfo(req: Request, res: Response, next: NextFunction) {
    try {
        //Search a song by id and clean the output
        const song = cleanOneSong(await Song.findById(req.params.id))

        res.json({
            status: "succes",
            data: {
                song
            }
        })

    } catch (e) {
        logger.crit(e)
        res.json({
            status: "fail"
        })
    }
}

export async function updateSongInfo(req: Request, res: Response, next: NextFunction) {
    try {
        const song = await Song.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.json({
            status: "succes",
            data: {
                song
            }
        })

    } catch (e) {
        logger.crit(e)
        res.json({
            status: "fail"
        })
    }
}

export async function getSongStream(req: Request, res: Response, next: NextFunction) {
    try {
        //Search a song by id and and send the file
        const song = await Song.findById(req.params.id)

        res.sendFile(song.path)

    } catch (e) {
        console.error(e)
        res.json({
            status: "fail"
        })
    }
}

export async function updateLike(req: Request, res: Response, next: NextFunction) {
    try {
        //Search a song by id
        const song = await Song.findById(req.params.id)

        //Update the like field
        song.like = Number(req.body.like)
        await song.save()

        res.json({
            status: "succes"
        })
    }
    catch (e) {
        console.log(e)
        res.json({
            status: "fail"
        })
    }
}