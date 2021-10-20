import { Document } from "mongoose"

import { Artist, IArtist } from "../models/artistModel"
import { IAlbum } from "../models/albumModel"

async function getArtist(album: IAlbum) {
    var artist: IArtist & Document<any, any, IArtist> = null
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