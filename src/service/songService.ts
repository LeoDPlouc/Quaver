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

import { createSongModel, findSongModelByPath, getAllSongModels, getSongModel, updateSongModel } from "../access/database/songDAO";
import { mapSong } from "../mappers/songMapper";


export async function getAllSongs(): Promise<Song[]> {
    return (await getAllSongModels()).map(s => mapSong(s))
}

export async function getSong(id: string): Promise<Song> {

    var model = await getSongModel(id)

    if (!model) return null
    return mapSong(model)
}

export async function updateSong(song: Song) {
    await updateSongModel(song)
}

export async function createSong(song: Song): Promise<string> {
    return await createSongModel(song)
}

export async function findSongByPath(path: string): Promise<Song> {

    var model = await findSongModelByPath(path)

    if (!model) return null
    return mapSong(model)
}