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

import { FilterQuery, Schema, model } from "mongoose";
import { injectable } from "tsyringe";
import { AlbumDb } from "./interfaces/albumDb";

const albumSchema = new Schema<AlbumDb>({
  title: {
    type: String,
  },
  artist: { // DEPRECATED
    type: String,
  },
  artistId: { // DEPRECATED
    type: String,
  },
  cover: { // DEPRECATED
    type: String,
  },
  artists: {
    type: [Schema.Types.ObjectId],
    ref: "Artist"
  },
  coverV2: {
    type: Schema.Types.ObjectId,
    ref: "Image"
  },
  year: {
    type: Number,
  },
  mbid: {
    type: String,
  },
  mbids: {
    type: [String],
  },
  lastUpdated: {
    type: Number,
  },
  lastCoverUpdate: {
    type: Number,
  },
  joinings: [{
    mbid: String,
    joinphrase: String
  }]
});

const albumModel = model<AlbumDb>("Album", albumSchema)

@injectable()
export class AlbumModel {

  public get model() { return albumModel }

  public find(query?: FilterQuery<AlbumDb>) {
    return albumModel.find(query || {})
  }

  public findById(id: string) {
    return albumModel.findById(id)
  }

  public create(album: AlbumDb) {
    return albumModel.create(album)
  }

  public findByIdAndUpdate(id: string, album: AlbumDb) {
    return albumModel.findByIdAndUpdate(id, album)
  }

  public deleteMany(query?: FilterQuery<AlbumDb>) {
    return albumModel.deleteMany(query || {})
  }
}
