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

import { Document, Types } from "mongoose"
import { AlbumDb } from "../access/database/models/interfaces/albumDb"
import { mapArtist, mapArtistDTO } from "./artistMapper"
import { mapImage, mapImageDTO } from "./imageMapper"

export function mapAlbum(data: Album & Document<any, any, Album>): Album {
    let cleanedData: Album = {
        id: data._id,
        title: data.title,
        artist: data.artist, // DEPRECATED
        artistId: data.artistId, // DEPRECATED
        cover: data.cover, // DEPRECATED
        artists: data.artists.map(a => mapArtist(<Artist & Document<any, any, Artist>>a)),
        coverV2: data.coverV2 ? mapImage(<Image & Document<any, any, Image>>data.coverV2) : undefined,
        lastCoverUpdate: data.lastCoverUpdate,
        lastUpdated: data.lastUpdated,
        year: data.year,
        mbid: data.mbid,
        mbids: data.mbids
    }
    return cleanedData
}

export function mapAlbumDTO(data: Album): AlbumDTO {
    let cleanedData: AlbumDTO = {
        id: data.id,
        title: data.title,
        artist: data.artist, // DEPRECATED
        artistId: data.artistId, // DEPRECATED
        artists: data.artists?.map(mapArtistDTO),
        cover: data.cover, // DEPRECATED
        coverV2: data.coverV2 ? mapImageDTO(data.coverV2) : undefined,
        year: data.year
    }
    return cleanedData
}

export function mapAlbumDb(data: Album): AlbumDb {
    let cleanedData: AlbumDb = {
        artist: data.artist, // DEPRECATED
        artistId: data.artistId, // DEPRECATED
        artists: data.artists?.map(a => new Types.ObjectId(a.id)),
        cover: data.cover, // DERECATED
        coverV2: data.coverV2 ? new Types.ObjectId(data.coverV2.id) : undefined,
        lastCoverUpdate: data.lastCoverUpdate,
        lastUpdated: data.lastUpdated,
        mbid: data.mbid,
        mbids: data.mbids, // DEPRECATED
        title: data.title,
        year: data.year
    }

    return cleanedData
}