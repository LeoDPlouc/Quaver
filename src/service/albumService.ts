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

import {
  createAlbumModel,
  findAlbumModelByName,
  getAlbumModel,
  getAlbumSongModel,
  getAllAlbumModels,
  updateAlbumModel,
} from "../access/database/albumDAO";
import { mapAlbum } from "../mappers/albumMapper";
import { mapSong } from "../mappers/songMapper";
import { createFailure, Failable } from "../utils/Failable";

export async function getAllAlbums(): Promise<Failable<Album[]>> {
  let result = await getAllAlbumModels();

  if (result.failure) {
    return {
      failure: createFailure(
        "DAO error",
        __filename,
        getAllAlbums.name,
        result.failure
      ),
    };
  }

  return { result: result.result.map((a) => mapAlbum(a)) };
}

export async function getAlbum(id: string): Promise<Failable<Album>> {
  let result = await getAlbumModel(id);

  if (result.failure) {
    return {
      failure: createFailure(
        "DAO error",
        __filename,
        getAlbum.name,
        result.failure
      ),
    };
  }

  if (!result.result) {
    return {
      failure: createFailure("Invalid Id", __filename, getAlbum.name),
    };
  }

  return { result: mapAlbum(result.result) };
}

export async function getAlbumSongs(id: string): Promise<Failable<Song[]>> {
  let result = await getAlbumSongModel(id);

  if (result.failure) {
    return {
      failure: createFailure(
        "DAO error",
        __filename,
        getAlbumSongs.name,
        result.failure
      ),
    };
  }

  if (!result.result) {
    return {
      failure: createFailure("Invalid Id", __filename, getAlbumSongs.name),
    };
  }

  return { result: result.result.map((s) => mapSong(s)) };
}

export async function createAlbum(album: Album): Promise<Failable<string>> {
  let result = await createAlbumModel(album);

  if (result.failure) {
    return {
      failure: createFailure(
        "DAO error",
        __filename,
        createAlbum.name,
        result.failure
      ),
    };
  }

  return { result: result.result };
}

export async function findAlbumByName(
  albumTitle: string,
  artistName?: string
): Promise<Failable<Album[]>> {
  let result = await findAlbumModelByName(albumTitle, artistName);

  if (result.failure) {
    return {
      failure: createFailure(
        "DAO error",
        __filename,
        findAlbumByName.name,
        result.failure
      ),
    };
  }

  return { result: result.result.map((a) => mapAlbum(a)) };
}

export async function updateAlbum(album: Album) {
  let result = await updateAlbumModel(album);

  if (result.failure) {
    return {
      failure: createFailure(
        "DAO error",
        __filename,
        updateAlbum.name,
        result.failure
      ),
    };
  }

  return { result: null };
}
