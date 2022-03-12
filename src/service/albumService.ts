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

import { createAlbumModel, findAlbumModelByName, getAlbumModel, getAlbumSongModel, getAllAlbumModels } from "../access/database/albumDAO";
import { mapAlbum } from "../mappers/albumMapper";
import { mapSong } from "../mappers/songMapper";

export async function getAllAlbums(): Promise<Album[]> {
    return (await getAllAlbumModels()).map(a => mapAlbum(a))
}

export async function getAlbum(id: string): Promise<Album> {
    return mapAlbum(await getAlbumModel(id))
}

export async function getAlbumSongs(id: string): Promise<Song[]> {
    return (await getAlbumSongModel(id)).map(s => mapSong(s))
}

export async function createAlbum(album: Album) {
    await createAlbumModel(album)
}

export async function findAlbumByName(albumTitle: string, artistName?: string): Promise<Album[]> {
    return (await findAlbumModelByName(albumTitle, artistName)).map(a => mapAlbum(a))
}