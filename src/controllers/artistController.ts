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
import { Album } from "../models/albumModel"

import { Artist, IArtist } from "../models/artistModel"
import { Song } from "../models/songModel"
import { cleanManyAlbums } from "./albumController"
import { cleanManySongs } from "./songController"

export function cleanOneArtist(data: IArtist & Document<any, any, IArtist>): any {
    var cleanedData = {
        id: data._id,
        name: data.name,
        cover: data.cover
    }
    return cleanedData
}

export function cleanManyArtists(datas: (IArtist & Document<any, any, IArtist>)[]): any[] {
    var cleaned = []
    datas.forEach((data, i) => cleaned.push(cleanOneArtist(data)))
    return cleaned
}

export async function getAllArtists(req: Request, res: Response, next: NextFunction) {
    try {
        //Search all artists in the db and clean the output
        const artists = cleanManyArtists(await Artist.find())

        res.json({
            status: "succes",
            results: artists.length,
            data: {
                artists
            }
        })

    } catch (e) {
        res.json({
            status: "fail"
        })
    }
}

export async function getOneArtist(req: Request, res: Response, next: NextFunction) {
    try {
        //Search an artist by id and clean the output
        const artist = cleanOneArtist(await Artist.findById(req.params.id))

        res.json({
            status: "succes",
            data: {
                artist
            }
        })

    } catch (e) {
        res.json({
            status: "fail"
        })
    }
}

export async function updateArtist(req: Request, res: Response, next: NextFunction) {
    try {
        const artist = await Artist.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        })

        res.json({
            status: "succes",
            data: {
                artist
            }
        })

    } catch (e) {
        res.json({
            status: "fail"
        })
    }
}

export async function getArtistSongs(req: Request, res: Response, next: NextFunction) {
    try {
        //Search songs by artistId and clean the output
        const songs = await Song.find({ artistId: req.params.id })
        const cleanedSongs = cleanManySongs(songs)

        res.json({
            status: "succes",
            data: {
                songs: cleanedSongs
            }
        })
    }
    catch {
        res.json({
            status: "fail"
        })
    }
}

export async function getArtistAlbums(req: Request, res: Response, next: NextFunction) {
    try {
        //Search albums by artistId and clean the output
        const albums = await Album.find({ artistId: req.params.id })
        const cleanedAlbums = cleanManyAlbums(albums)

        res.json({
            status: "succes",
            data: {
                albums: cleanedAlbums
            }
        })
    }
    catch {
        res.json({
            status: "fail"
        })
    }
}