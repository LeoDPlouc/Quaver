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
import { createFailure } from "../../utils/Failure";
import { albumModel } from "./models/albumModel";
import { songModel } from "./models/songModel";

export async function getAllAlbumModels(): Promise<
  (Album & Document<any, any, Album>)[]
> {
  try {
    return await albumModel.find();
  } catch (err) {
    throw createFailure(err, __filename, getAllAlbumModels.name);
  }
}

export async function getAlbumModel(
  id: string
): Promise<Album & Document<any, any, Album>> {
  try {
    return await albumModel.findById(id);
  } catch (err) {
    throw createFailure(err, __filename, getAlbumModel.name);
  }
}

export async function getAlbumSongModel(
  id: string
): Promise<(Song & Document<any, any, Song>)[]> {
  try {
    return await songModel.find({ albumId: id });
  } catch (err) {
    throw createFailure(err, __filename, getAlbumSongModel.name);
  }
}

export async function createAlbumModel(album: Album): Promise<string> {
  try {
    return (await albumModel.create(album)).id;
  } catch (err) {
    throw createFailure(err, __filename, createAlbumModel.name);
  }
}

export async function findAlbumModelByName(
  albumTitle: string,
  artistName?: string
): Promise<(Album & Document<any, any, Album>)[]> {
  var query: Album = { title: albumTitle };
  if (artistName) query.artist = artistName;

  try {
    return await albumModel.find(query);
  } catch (err) {
    throw createFailure(err, __filename, findAlbumModelByName.name);
  }
}

export async function updateAlbumModel(album: Album): Promise<void> {
  try {
    await albumModel.findByIdAndUpdate(album.id, album);
  } catch (err) {
    throw createFailure(err, __filename, updateAlbumModel.name);
  }
}

export async function getMbidlessAlbumModels(): Promise<
  (Album & Document<any, any, Album>)[]
> {
  try {
    return await albumModel.find({ mbids: { $size: 0 } });
  } catch (err) {
    throw createFailure(err, __filename, getMbidlessAlbumModels.name);
  }
}
