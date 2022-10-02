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

export function mapAlbum(data: Album & Document<any, any, Album>): Album {
    let cleanedData: Album = {
        id: data.id,
        title: data.title,
        artist: data.artist, // DEPRECATED
        artistId: data.artistId, // DEPRECATED
        cover: data.cover, // DEPRECATED
        artistV2: data.artistV2,
        coverV2: data.coverV2,
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
        artist: data.artist,
        artistId: data.artistId,
        cover: data.cover,
        year: data.year
    }
    return cleanedData
}