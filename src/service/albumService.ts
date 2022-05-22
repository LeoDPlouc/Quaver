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

import { getMBId, getMetadataFromMB } from "../access/api/musicbrainzApi";
import {
  createAlbumModel,
  findAlbumModelByName,
  getAlbumModel,
  getAlbumSongModel,
  getAllAlbumModels,
  getMbidlessAlbumModels,
  updateAlbumModel,
} from "../access/database/albumDAO";
import { mapAlbum } from "../mappers/albumMapper";
import { mapSong } from "../mappers/songMapper";
import { createFailure } from "../utils/Failure";

export async function getAllAlbums(): Promise<Album[]> {
  try {
    var result = await getAllAlbumModels();
  } catch (err) {
    throw createFailure("DAO error", __filename, getAllAlbums.name, err);
  }

  return result.map((a) => mapAlbum(a));
}

export async function getAlbum(id: string): Promise<Album> {
  try {
    var result = await getAlbumModel(id);
  } catch (err) {
    throw createFailure("DAO error", __filename, getAlbum.name, err);
  }

  if (!result) {
    throw createFailure("Invalid Id", __filename, getAlbum.name);
  }

  return mapAlbum(result);
}

export async function getAlbumSongs(id: string): Promise<Song[]> {
  try {
    var result = await getAlbumSongModel(id);
  } catch (err) {
    throw createFailure("DAO error", __filename, getAlbumSongs.name, err);
  }

  if (!result) {
    throw createFailure("Invalid Id", __filename, getAlbumSongs.name);
  }

  return result.map((s) => mapSong(s));
}

export async function createAlbum(album: Album): Promise<string> {
  try {
    var result = await createAlbumModel(album);
  } catch (err) {
    throw createFailure("DAO error", __filename, createAlbum.name, err);
  }

  return result;
}

export async function findAlbumByName(
  albumTitle: string,
  artistName?: string
): Promise<Album[]> {
  try {
    var result = await findAlbumModelByName(albumTitle, artistName);
  } catch (err) {
    throw createFailure("DAO error", __filename, findAlbumByName.name, err);
  }

  return result.map((a) => mapAlbum(a));
}

export async function updateAlbum(album: Album): Promise<void> {
  try {
    await updateAlbumModel(album);
  } catch (err) {
    throw createFailure("DAO error", __filename, updateAlbum.name, err);
  }
}

export async function getMbidlessAlbum(): Promise<Album[]> {
  try {
    var result = await getMbidlessAlbumModels();
  } catch (err) {
    throw createFailure("DAO error", __filename, getMbidlessAlbum.name);
  }

  return result.map((a) => mapAlbum(a));
}

export async function getAlbumMbid(album: Album): Promise<string[]> {
  try {
    return getMBId(album);
  } catch (err) {
    throw createFailure("API error", __filename, getAlbumMbid.name);
  }
}

export async function getAlbumMetadata(album: Album): Promise<Album> {
  return getMetadataFromMB(album.mbids);
}
