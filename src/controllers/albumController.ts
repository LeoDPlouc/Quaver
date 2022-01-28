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
import { cleanManySongs } from "./songController"

export function cleanOneAlbum(data: IAlbum & Document<any, any, IAlbum>): any {
    var cleanedData = {
        id: data._id,
        title: data.title,
        artist: data.artist,
        artistId: data.artistId,
        year: data.year
    }
    return cleanedData
}

export function cleanManyAlbums(datas: (IAlbum & Document<any, any, IAlbum>)[]): any[] {
    var cleaned = []
    datas.forEach((data, i) => cleaned.push(cleanOneAlbum(data)))
    return cleaned
}

async function getAllAlbums(req: Request, res: Response, next: NextFunction) {
    try {
        //Search all albums in the db and clean the output
        const albums = cleanManyAlbums(await Album.find())

        res.json({
            status: "succes",
            results: albums.length,
            data: {
                albums
            }
        })

    } catch (e) {
        console.debug(e)
        res.json({
            status: "fail"
        })
    }
}

async function getOneAlbum(req: Request, res: Response, next: NextFunction) {
    try {
        //Search an album by id and clean the output
        const album = cleanOneAlbum(await Album.findById(req.params.id))

        res.json({
            status: "succes",
            data: {
                album
            }
        })

    } catch (e) {
        res.json({
            status: "fail"
        })
    }
}

async function updateAlbum(req: Request, res: Response, next: NextFunction) {
    try {
        const album = await Album.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.json({
            status: "succes",
            data: {
                album
            }
        })

    } catch (e) {
        res.json({
            status: "fail"
        })
    }
}

export async function getAlbumSongs(req: Request, res: Response, next: NextFunction) {
    try {
        //Search songs by albumid in the db and clean the output
        const songs = await Song.find({ albumId: req.params.id })
        var cleanedSongs = cleanManySongs(songs)

        res.json({
            status: "succes",
            results: cleanedSongs.length,
            data: {
                songs: cleanedSongs
            }
        })
    } catch {
        res.json({
            status: "fail"
        })
    }
}

export { getAllAlbums, getOneAlbum, updateAlbum }