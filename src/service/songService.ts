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
  createSongModel,
  findSongModelByPath,
  getAllSongModelPaths,
  getAllSongModels,
  getSongModel,
  updateSongModel,
} from "../access/database/songDAO";
import { mapSong } from "../mappers/songMapper";
import { createFailure } from "../utils/Failure";

export async function getAllSongs(): Promise<Song[]> {
  try {
    var result = await getAllSongModels();
  } catch (err) {
    throw createFailure("DAO error", __filename, getAllSongs.name, err);
  }

  return result.map((s) => mapSong(s));
}

export async function getSong(id: string): Promise<Song> {
  try {
    var result = await getSongModel(id);
  } catch (err) {
    throw createFailure("DAO error", __filename, getSong.name, err);
  }

  if (!result) {
    throw createFailure("Invalid Id", __filename, getSong.name);
  }

  return mapSong(result);
}

export async function updateSong(song: Song): Promise<void> {
  try {
    var result = await updateSongModel(song);
  } catch (err) {
    throw createFailure("DAO error", __filename, updateSong.name, err);
  }
}

export async function createSong(song: Song): Promise<string> {
  try {
    var result = await createSongModel(song);
  } catch (err) {
    throw createFailure("DAO error", __filename, createSong.name, err);
  }

  return result;
}

export async function findSongByPath(path: string): Promise<Song> {
  try {
    var result = await findSongModelByPath(path);
  } catch (err) {
    throw createFailure("DAO error", __filename, findSongByPath.name, err);
  }

  if (!result) {
    throw createFailure(
      "No song at path " + path,
      __filename,
      findSongByPath.name
    );
  }

  return mapSong(result);
}

export async function getAllSongPaths(): Promise<string[]> {
  try {
    var result = await getAllSongModelPaths();
  } catch (err) {
    throw createFailure("DAO error", __filename, getAllSongPaths.name, err);
  }

  return result;
}
