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

import { Document } from "mongoose"

import { Artist, IArtist } from "../models/artistModel"
import { IAlbum } from "../models/albumModel"
import { IReleaseList } from "musicbrainz-api"
import { APP_VERSION } from "../config/appConfig"
import { IImage, Image } from "../models/imageModel"
import coverart from "coverart"
import { saveImage } from "./imageProcessor"
import { mbApi } from "../apis/mbApi"

const ca = new coverart({ useragent: `Quaver/${APP_VERSION} (https://github.com/LeoDPlouc/Quaver)` })

export async function getAlbumMBId(album: IAlbum): Promise<string[]> {

    var query = `release:${album.title as string}`

    if (album.artist) query += ` and artist:${album.artist}`

    var result = await mbApi.search<IReleaseList>("release", { query })

    var releases = result.releases.filter(release => release.score == 100)
    var ids = releases.map(release => release.id)

    return ids
}

export async function getAlbumCover(album: IAlbum): Promise<IImage & Document<any, any, IImage>> {

    var p = new Promise<any>((resolve, reject) => {
        ca.release(album.mbid, { piece: "front" }, (err, data) => {
            if (err) reject(err)
            resolve(data)
        })
    })

    try {
        var { image, extension } = await p
        var path = await saveImage(image, extension)

        return new Image({ path })
    }
    catch { return null }
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

        console.log(`Found new artist ${artist.name}`)
    }

    return artist
}