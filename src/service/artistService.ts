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

import { getAllArtistModels, getArtistAlbumModels, getArtistModel, getArtistSongModels } from "../access/database/artistDAO";
import { mapAlbum } from "../mappers/albumMapper";
import { mapArtist } from "../mappers/artistMapper";
import { mapSong } from "../mappers/songMapper";

export async function getAllArtists(): Promise<Artist[]> {
    return (await getAllArtistModels()).map(a => mapArtist(a))
}

export async function getArtist(id: String): Promise<Artist> {
    return mapArtist(await getArtistModel(id))
}

export async function getArtistSongs(id: String): Promise<Song[]> {
    return (await getArtistSongModels(id)).map(s => mapSong(s))
}

export async function getArtistAlbums(id: String): Promise<Album[]> {
    return (await getArtistAlbumModels(id)).map(a => mapAlbum(a))
}