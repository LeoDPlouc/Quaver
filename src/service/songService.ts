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

import { getAllSongModels, getSongModel, updateSongModel } from "../access/database/songDAO";
import { mapSong } from "../mappers/songMapper";


export async function getAllSongs(): Promise<Song[]> {
    return (await getAllSongModels()).map(s => mapSong(s))
}

export async function getSong(id: String): Promise<Song> {
    return mapSong(await getSongModel(id))
}

export async function updateSong(song: Song) {
    updateSongModel(song)
}