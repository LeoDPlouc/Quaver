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

import { IReleaseList } from "musicbrainz-api"
import { Document } from "mongoose"
import logger from "../../../../utils/logger"
import { mbApi } from "../../../api/musicbrainzApi"
import { caApi } from "../../../api/coverArtArchive"
import { saveImage } from "../../../file/imageFile"
import { imageModel } from "../../models/imageModel"

export async function getAlbumMBIdLegacy(album: Album): Promise<string> {

    var query = `release:${album.title as string}`

    //Add more info to the query if available
    if (album.artist) query += ` and artist:${album.artist}`

    var result = await mbApi.search<IReleaseList>("release", { query })
    return result.releases[0].id
}

export async function getAlbumCoverLegacy(album: Album & Document<any, any, Album>): Promise<Image & Document<any, any, Image>> {

    //Fetch Cover art
    var p = new Promise<any>((resolve, reject) => {
        caApi.release(album.mbid, { piece: "front" }, (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })
    var { image, extension } = await p

    if (image) {
        logger.info(`Found new cover for ${album.id}`)
        //Save the image cover on the hard drive
        var path = await saveImage(image, extension)

        var newCover = new imageModel({ path })
        await newCover.save()

        return newCover
    }
    return null
}