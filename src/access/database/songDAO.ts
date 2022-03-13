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
import { songModel } from "./models/songModel";

export async function getAllSongModels(): Promise<(Song & Document<any, any, Song>)[]> {
    return await songModel.find()
}

export async function getSongModel(id: string): Promise<Song & Document<any, any, Song>> {
    return await songModel.findById(id)
}

export async function updateSongModel(song: Song) {
    await songModel.findByIdAndUpdate(song.id, song)
}

export async function createSongModel(song: Song): Promise<string> {
    return (await songModel.create(song)).id
}

export async function findSongModelByPath(path: string): Promise<Song & Document<any, any, Song>> {
    return (await songModel.find({ path }))[0]
}