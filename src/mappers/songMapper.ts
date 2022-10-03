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

export function mapSong(data: Song & Document<any, any, Song>): Song {
    let cleanedData: Song = {
        id: data.id,
        title: data.title,
        n: data.n,
        duration: data.duration,
        like: data.like,
        artist: data.artist,
        artistId: data.artistId,
        album: data.album,
        albumId: data.albumId,
        path: data.path,
        acoustid: data.acoustid,
        year: data.year,
        format: data.format,
        albumV2: data.albumV2,
        artistV2: data.artistV2,
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
        artist: data.artist,
        artistId: data.artistId,
        album: data.album,
        albumId: data.albumId,
        year: data.year,
        format: data.format
    }
    return cleanedData
}