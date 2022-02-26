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

import { ClientSession, Document, startSession } from "mongoose"
import { Artist, IArtist } from "../models/artistModel"
import { IAlbum } from "../models/albumModel"
import { IReleaseList } from "musicbrainz-api"
import { IImage, Image } from "../models/imageModel"
import { saveImage } from "./imageProcessor"
import { mbApi } from "../apis/mbApi"
import logger from "../utils/logger"
import { caApi } from "../apis/caApi"

export async function getAlbumMBId(album: IAlbum): Promise<string[]> {

    //Build query with available info
    var query = `release:${album.title as string}`

    if (album.artist) query += ` and artist:${album.artist}`

    var result = await mbApi.search<IReleaseList>("release", { query })

    //Only keep ids of the release with score 100
    var releases = result.releases.filter(release => release.score == 100)
    var ids = releases.map(release => release.id)

    return ids
}

export async function getAlbumCover(album: IAlbum & Document<any, any, IAlbum>, session: ClientSession): Promise<IImage & Document<any, any, IImage>> {

    var localSession = false
    if (!session) {
        session = await startSession()
        session.startTransaction()
        localSession = true
    }

    try {
        var cover
        var ext

        var i = 0
        //Try fetching cover art for every MB ID
        while (!cover && i < album.mbids.length) {
            try {
                //Fetch Cover art
                var p = new Promise<any>((resolve, reject) => {
                    caApi.release(album.mbids[i], { piece: "front" }, (err, data) => {
                        if (err) reject(err)
                        resolve(data)
                    })
                })
                var { image, extension } = await p
                cover = image
                ext = extension
            }
            catch { }
            finally { i++ }
        }

        if (image) {
            logger.info(`Found new cover for ${album.id}`)
            //Save the image cover on the hard drive
            var path = await saveImage(image, extension)

            var newCover = new Image({ path })
            await newCover.save({ session })

            return newCover
        }
        return null
    } catch (err) {
        if (localSession) await session.abortTransaction()
        throw err
    }
}

export async function getArtist(album: IAlbum) {
    var artist: IArtist & Document<any, any, IArtist> = null

    //If the artist doesn't already exist, creates it
    if (album.artistId)
        artist = await Artist.findById(album.artistId)
    else {
        artist = new Artist({
            name: album.artist
        })

        logger.info(`Found new artist ${artist.id}`)
    }

    return artist
}