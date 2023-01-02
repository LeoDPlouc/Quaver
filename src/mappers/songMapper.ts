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
import { SongDb } from "../access/database/models/interfaces/songDb"
import { SongDocument } from "../access/database/songDAO"
import { mapAlbum, mapAlbumDTO } from "./albumMapper"
import { mapArtist, mapArtistDTO } from "./artistMapper"

export function mapSong(data: SongDocument): Song {
    let cleanedData: Song = {
        id: data._id.toString(),
        title: data.title,
        n: data.n,
        duration: data.duration,
        like: data.like,
        artist: data.artist, // DEPRECATED
        artistId: data.artistId, // DEPRECATED
        album: data.album, // DEPRECATED
        albumId: data.albumId, // DEPRECATED
        path: data.path,
        acoustid: data.acoustid,
        year: data.year,
        format: data.format,
        albumV2: data.albumV2 ? mapAlbum(<Album & Document<any, any, Album>>data.albumV2) : undefined,
        artists: data.artists.map(a => mapArtist(<Artist & Document<any, any, Artist>>a)),
        lastUpdated: data.lastUpdated,
        mbid: data.mbid
    }
    return cleanedData
}

export function mapSongDTO(data: Song): SongDTO {
    let cleanedData: SongDTO = {
        id: data.id,
        title: data.title,
        n: data.n,
        duration: data.duration,
        like: data.like,
        artist: data.artist, // DEPRECATED
        artistId: data.artistId, // DEPRECATED
        album: data.album, // DEPRECATED
        albumId: data.albumId, // DEPRECATED
        artists: data.artists?.map(mapArtistDTO),
        albumV2: data.albumV2 ? mapAlbumDTO(data.albumV2) : undefined,
        year: data.year,
        format: data.format
    }
    return cleanedData
}

export function mapSongDb(data: Song): SongDb {
    let cleanedData: SongDb = {
        path: data.path,
        acoustid: data.acoustid,
        album: data.album, // DEPRECATED
        albumId: data.albumId, // DEPRECATED
        albumV2: data.albumV2 ? new Types.ObjectId(data.albumV2.id) : undefined,
        artist: data.artist, // DEPRECATED
        artistId: data.artistId, // DEPRECATED
        artists: data.artists?.map(a => new Types.ObjectId(a.id)),
        duration: data.duration,
        format: data.format,
        lastUpdated: data.lastUpdated,
        like: data.like,
        mbid: data.mbid,
        n: data.n,
        title: data.title,
        year: data.year
    }

    return cleanedData
}