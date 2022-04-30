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
import { Failable } from "../utils/Failable";

export async function getAllSongs(): Promise<Failable<Song[]>> {
  let result = await getAllSongModels();

  if (result.failure) {
    return {
      failure: {
        file: __filename,
        func: getAllSongs.name,
        msg: "DAO error",
        sourceFailure: result.failure,
      },
    };
  }

  return { result: result.result.map((s) => mapSong(s)) };
}

export async function getSong(id: string): Promise<Failable<Song>> {
  let result = await getSongModel(id);

  if (result.failure) {
    return {
      failure: {
        file: __filename,
        func: getSong.name,
        msg: "DAO error",
        sourceFailure: result.failure,
      },
    };
  }

  if (!result.result) {
    return {
      failure: {
        file: __filename,
        func: getSong.name,
        msg: "Invalid Id",
      },
    };
  }

  return { result: mapSong(result.result) };
}

export async function updateSong(song: Song): Promise<Failable<null>> {
  let result = await updateSongModel(song);

  if (result.failure) {
    return {
      failure: {
        file: __filename,
        func: updateSong.name,
        msg: "DAO error",
        sourceFailure: result.failure,
      },
    };
  }

  return { result: null };
}

export async function createSong(song: Song): Promise<Failable<string>> {
  let result = await createSongModel(song);

  if (result.failure) {
    return {
      failure: {
        file: __filename,
        func: createSong.name,
        msg: "DAO error",
        sourceFailure: result.failure,
      },
    };
  }

  return result;
}

export async function findSongByPath(path: string): Promise<Failable<Song>> {
  let result = await findSongModelByPath(path);

  if (result.failure) {
    return {
      failure: {
        file: __filename,
        func: findSongByPath.name,
        msg: "DAO error",
        sourceFailure: result.failure,
      },
    };
  }

  if (!result.result) {
    return {
      failure: {
        file: __filename,
        func: findSongByPath.name,
        msg: "No song at path " + path,
      },
    };
  }

  return { result: mapSong(result.result) };
}

export async function getAllSongPaths(): Promise<Failable<string[]>> {
  let result = await getAllSongModelPaths();

  if (result.failure) {
    return {
      failure: {
        file: __filename,
        func: getAllSongPaths.name,
        msg: "DAO error",
        sourceFailure: result.failure,
      },
    };
  }

  return result;
}
