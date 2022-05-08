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
import { albumModel } from "./models/albumModel";
import { songModel } from "./models/songModel";

export async function getAllAlbumModels(): Promise<
  Failable<(Album & Document<any, any, Album>)[]>
> {
  try {
    return { result: await albumModel.find() };
  } catch (err) {
    return { failure: createFailure(err, __filename, getAllAlbumModels.name) };
  }
}

export async function getAlbumModel(
  id: string
): Promise<Failable<Album & Document<any, any, Album>>> {
  try {
    return { result: await albumModel.findById(id) };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, getAlbumModel.name),
    };
  }
}

export async function getAlbumSongModel(
  id: string
): Promise<Failable<(Song & Document<any, any, Song>)[]>> {
  try {
    return { result: await songModel.find({ albumId: id }) };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, getAlbumSongModel.name),
    };
  }
}

export async function createAlbumModel(
  album: Album
): Promise<Failable<string>> {
  try {
    return { result: (await albumModel.create(album)).id };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, createAlbumModel.name),
    };
  }
}

export async function findAlbumModelByName(
  albumTitle: string,
  artistName?: string
): Promise<Failable<(Album & Document<any, any, Album>)[]>> {
  var query: Album = { title: albumTitle };
  if (artistName) query.artist = artistName;

  try {
    return { result: await albumModel.find(query) };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, findAlbumModelByName.name),
    };
  }
}

export async function updateAlbumModel(album: Album): Promise<Failable<null>> {
  try {
    await albumModel.findByIdAndUpdate(album.id, album);
    return { result: null };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, updateAlbumModel.name),
    };
  }
}
