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
import { artistModel } from "./models/artistModel";
import { songModel } from "./models/songModel";

export async function getAllArtistModels(): Promise<
  Failable<(Artist & Document<any, any, Artist>)[]>
> {
  try {
    return { result: await artistModel.find() };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, getAllArtistModels.name),
    };
  }
}

export async function getArtistModel(
  id: string
): Promise<Failable<Artist & Document<any, any, Artist>>> {
  try {
    return { result: await artistModel.findById(id) };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, getArtistModel.name),
    };
  }
}

export async function getArtistSongModels(
  id: string
): Promise<Failable<(Song & Document<any, any, Song>)[]>> {
  try {
    return { result: await songModel.find({ artistId: id }) };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, getArtistSongModels.name),
    };
  }
}

export async function getArtistAlbumModels(
  id: string
): Promise<Failable<(Album & Document<any, any, Album>)[]>> {
  try {
    return { result: await albumModel.find({ artistId: id }) };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, getArtistAlbumModels.name),
    };
  }
}

export async function createArtistModel(
  artist: Artist
): Promise<Failable<string>> {
  try {
    return { result: (await artistModel.create(artist)).id };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, createArtistModel.name),
    };
  }
}

export async function findArtistModelByName(
  name: string
): Promise<Failable<(Artist & Document<any, any, Artist>)[]>> {
  try {
    return { result: await artistModel.find({ name: name }) };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, findArtistModelByName.name),
    };
  }
}

export async function updateArtistModel(
  artist: Artist
): Promise<Failable<null>> {
  try {
    await artistModel.findByIdAndUpdate(artist.id, artist);
    return { result: null };
  } catch (err) {
    return {
      failure: createFailure(err, __filename, updateArtistModel.name),
    };
  }
}
