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

import { Document } from "mongoose";
import { albumModel } from "./models/albumModel";
import { songModel } from "./models/songModel";

export async function getAllAlbumModels(): Promise<(Album & Document<any, any, Album>)[]> {
    return await albumModel.find()
}

export async function getAlbumModel(id: string): Promise<Album & Document<any, any, Album>> {
    return await albumModel.findById(id)
}

export async function getAlbumSongModel(id: string): Promise<(Song & Document<any, any, Song>)[]> {
    return await songModel.find({ albumId: id })
}

export async function createAlbumModel(album: Album) {
    await albumModel.create(album)
}

export async function findAlbumModelByName(albumTitle: string, artistName?: string): Promise<(Album & Document<any, any, Album>)[]> {

    var query: Album = { title: albumTitle }
    if (artistName) query.artist = artistName

    return await albumModel.find(query)
}