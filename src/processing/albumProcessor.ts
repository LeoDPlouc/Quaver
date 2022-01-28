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

async function getArtist(album: IAlbum) {
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

export { getArtist }