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

import { Document, Types } from "mongoose";
import { UPDATE_METADATA_PERIOD } from "../../config/appConfig";
import { Song } from "../../models/song";
import { DAOException } from "./exceptions/DAOException";
import { SongDb } from "./models/interfaces/songDb";
import { injectable } from "tsyringe";
import { SongModel } from "./models/songModel";
import { SongMapper } from "../../mappers/songMapper";

export type SongDocument = Omit<Omit<Document<unknown, any, SongDb> & SongDb & { _id: Types.ObjectId; }, "albumV2"> & Pick<Song, "albumV2">, "artists"> & Pick<Song, "artists">;

@injectable()
export class SongDAO {
  public async getAllSongModel(this: SongDAO): Promise<SongDocument[]> {
    try {
      return await this.songModel.find()
        .populate<Pick<Song, "albumV2">>("albumV2")
        .populate<Pick<Song, "artists">>("artists")
    } catch (err) {
      throw new DAOException(__filename, "getAllSongModel", err);
    }
  }

  public async getSongModel(this: SongDAO, id: string): Promise<SongDocument> {
    try {
      return await this.songModel.findById(id)
        .populate<Pick<Song, "albumV2">>("albumV2")
        .populate<Pick<Song, "artists">>("artists")
    } catch (err) {
      throw new DAOException(__filename, "getSongModel", err);
    }
  }

  public async updateSongModel(this: SongDAO, song: Song): Promise<void> {
    try {
      await this.songModel.findByIdAndUpdate(song.id, this.songMapper.toSongDb(song))
    } catch (err) {
      throw new DAOException(__filename, "updateSongModel", err);
    }
  }

  public async createSongModel(this: SongDAO, song: Song): Promise<string> {
    try {
      return await this.songModel.create(this.songMapper.toSongDb(song))
        .then((s) => s.id)
    } catch (err) {
      throw new DAOException(__filename, "createSongModel", err);
    }
  }

  public async findSongModelByPath(this: SongDAO, path: string): Promise<SongDocument> {
    try {
      return await this.songModel.find({ path })
        .populate<Pick<Song, "albumV2">>("albumV2")
        .populate<Pick<Song, "artists">>("artists")
        .then((s) => s[0])
    } catch (err) {
      throw new DAOException(__filename, "findSongModelByPath", err);
    }
  }

  public async getPathsFromAllSong(this: SongDAO): Promise<string[]> {
    try {
      return await this.songModel.find({}, { path: 1 })
        .then((s) => s.map((s) => s.path))
    } catch (err) {
      throw new DAOException(__filename, "getPathsFromAllSong", err);
    }
  }

  public async getMbidlessSongModel(this: SongDAO): Promise<SongDocument[]> {
    try {
      return await this.songModel.find({
        mbid: { $exists: false }
      })
        .populate<Pick<Song, "albumV2">>("albumV2")
        .populate<Pick<Song, "artists">>("artists")
    } catch (err) {
      throw new DAOException(__filename, "getMbidlessSongModel", err);
    }
  }

  public async getSongModelForMetadataGrabber(this: SongDAO): Promise<SongDocument[]> {
    try {
      return await this.songModel.find({
        $or: [
          { lastUpdated: { $lt: Date.now() - UPDATE_METADATA_PERIOD } },
          { lastUpdated: { $exists: false } }
        ],
      })
        .populate<Pick<Song, "albumV2">>("albumV2")
        .populate<Pick<Song, "artists">>("artists")
    } catch (err) {
      throw new DAOException(__filename, "getSongModelForMetadataGrabber", err);
    }
  }

  constructor(
    private songModel: SongModel,
    private songMapper: SongMapper
  ) { }
}
