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
import { albumModel } from "./models/albumModel"
import { ArtistModel } from "./models/artistModel"
import { SongModel } from "./models/songModel"

export async function getAllArtistModels(): Promise<(Artist & Document<any, any, Artist>)[]> {
    return await ArtistModel.find()
}

export async function getArtistModel(id: String): Promise<Artist & Document<any, any, Artist>> {
    return await ArtistModel.findById(id)
}

export async function getArtistSongModels(id: String): Promise<(Song & Document<any, any, Song>)[]> {
    return await SongModel.find({ artistId: id })
}

export async function getArtistAlbumModels(id: String): Promise<(Album & Document<any, any, Album>)[]> {
    return await albumModel.find({ artistId: id })
}