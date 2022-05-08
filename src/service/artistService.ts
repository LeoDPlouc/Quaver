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
  createArtistModel,
  getAllArtistModels,
  getArtistAlbumModels,
  getArtistModel,
  getArtistSongModels,
  findArtistModelByName,
  updateArtistModel,
} from "../access/database/artistDAO";
import { mapAlbum } from "../mappers/albumMapper";
import { mapArtist } from "../mappers/artistMapper";
import { mapSong } from "../mappers/songMapper";
import { createFailure, Failable } from "../utils/Failable";

export async function getAllArtists(): Promise<Failable<Artist[]>> {
  let result = await getAllArtistModels();

  if (result.failure) {
    return {
      failure: createFailure(
        "DAO error",
        __filename,
        getAllArtists.name,
        result.failure
      ),
    };
  }

  return { result: result.result.map((a) => mapArtist(a)) };
}

export async function getArtist(id: string): Promise<Failable<Artist>> {
  let result = await getArtistModel(id);

  if (result.failure) {
    return {
      failure: createFailure(
        "DAO error",
        __filename,
        getArtist.name,
        result.failure
      ),
    };
  }

  if (!result.result) {
    return {
      failure: createFailure("Invalid Id", __filename, getArtist.name),
    };
  }

  return { result: mapArtist(result.result) };
}

export async function getArtistSongs(id: string): Promise<Failable<Song[]>> {
  let result = await getArtistSongModels(id);

  if (result.failure) {
    return {
      failure: createFailure(
        "DAO error",
        __filename,
        getArtistSongs.name,
        result.failure
      ),
    };
  }

  return { result: result.result.map((s) => mapSong(s)) };
}

export async function getArtistAlbums(id: string): Promise<Failable<Album[]>> {
  let result = await getArtistAlbumModels(id);

  if (result.failure) {
    return {
      failure: createFailure(
        "DAO error",
        __filename,
        getArtistAlbums.name,
        result.failure
      ),
    };
  }

  return { result: result.result.map((a) => mapAlbum(a)) };
}

export async function createArtist(artist: Artist): Promise<Failable<string>> {
  let result = await createArtistModel(artist);

  if (result.failure) {
    return {
      failure: createFailure(
        "DAO error",
        __filename,
        createArtist.name,
        result.failure
      ),
    };
  }

  return { result: result.result };
}

export async function findArtistByName(
  name: string
): Promise<Failable<Artist[]>> {
  let result = await findArtistModelByName(name);

  if (result.failure) {
    return {
      failure: createFailure(
        "DAO error",
        __filename,
        findArtistByName.name,
        result.failure
      ),
    };
  }

  return { result: result.result.map((a) => mapArtist(a)) };
}

export async function updateArtist(artist: Artist): Promise<Failable<null>> {
  let result = await updateArtistModel(artist);

  if (result.failure) {
    return {
      failure: createFailure(
        "DAO error",
        __filename,
        updateArtist.name,
        result.failure
      ),
    };
  }

  return { result: null };
}
