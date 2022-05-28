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
import { createFailure } from "../utils/Failure";

export async function getAllArtists(): Promise<Artist[]> {
  try {
    var result = await getAllArtistModels();
  } catch (err) {
    throw createFailure("DAO error", __filename, getAllArtists.name, err);
  }

  return result.map((a) => mapArtist(a));
}

export async function getArtist(id: string): Promise<Artist> {
  try {
    var result = await getArtistModel(id);
  } catch (err) {
    throw createFailure("DAO error", __filename, getArtist.name, err);
  }

  if (!result) {
    throw createFailure("Invalid Id", __filename, getArtist.name);
  }

  return mapArtist(result);
}

export async function getArtistSongs(id: string): Promise<Song[]> {
  try {
    var result = await getArtistSongModels(id);
  } catch (err) {
    throw createFailure("DAO error", __filename, getArtistSongs.name, err);
  }

  return result.map((s) => mapSong(s));
}

export async function getArtistAlbums(id: string): Promise<Album[]> {
  try {
    var result = await getArtistAlbumModels(id);
  } catch (err) {
    throw createFailure("DAO error", __filename, getArtistAlbums.name, err);
  }

  return result.map((a) => mapAlbum(a));
}

export async function createArtist(artist: Artist): Promise<string> {
  try {
    var result = await createArtistModel(artist);
  } catch (err) {
    throw createFailure("DAO error", __filename, createArtist.name, err);
  }

  return result;
}

export async function findArtistByName(name: string): Promise<Artist[]> {
  try {
    var result = await findArtistModelByName(name);
  } catch (err) {
    throw createFailure("DAO error", __filename, findArtistByName.name, err);
  }

  return result.map((a) => mapArtist(a));
}

export async function updateArtist(artist: Artist): Promise<void> {
  try {
    await updateArtistModel(artist);
  } catch (err) {
    throw createFailure("DAO error", __filename, updateArtist.name, err);
  }
}
