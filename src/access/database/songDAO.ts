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

import { Document } from "mongoose";
import { createFailure, Failable } from "../../utils/Failable";
import { songModel } from "./models/songModel";

export async function getAllSongModels(): Promise<
  Failable<(Song & Document<any, any, Song>)[]>
> {
  try {
    return { result: await songModel.find() };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, getAllSongModels.name),
    };
  }
}

export async function getSongModel(
  id: string
): Promise<Failable<Song & Document<any, any, Song>>> {
  try {
    return { result: await songModel.findById(id) };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, getSongModel.name),
    };
  }
}

export async function updateSongModel(song: Song): Promise<Failable<null>> {
  try {
    await songModel.findByIdAndUpdate(song.id, song);
    return { result: null };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, updateSongModel.name),
    };
  }
}

export async function createSongModel(song: Song): Promise<Failable<string>> {
  try {
    return { result: (await songModel.create(song)).id };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, createSongModel.name),
    };
  }
}

export async function findSongModelByPath(
  path: string
): Promise<Failable<Song & Document<any, any, Song>>> {
  try {
    return { result: (await songModel.find({ path }))[0] };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, findSongModelByPath.name),
    };
  }
}

export async function getAllSongModelPaths(): Promise<Failable<string[]>> {
  try {
    return {
      result: (await songModel.find({}, { path: 1 })).map((s) => s.path),
    };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, getAllSongModelPaths.name),
    };
  }
}
