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
import { mapSongDb } from "../../mappers/songMapper";
import { Song } from "../../models/song";
import { DAOException } from "./exceptions/DAOException";
import { SongDb } from "./models/interfaces/songDb";
import { songModel } from "./models/songModel";

export type SongDocument = Omit<Omit<Document<unknown, any, SongDb> & SongDb & { _id: Types.ObjectId; }, "albumV2"> & Pick<Song, "albumV2">, "artists"> & Pick<Song, "artists">;

class SongDAO {
  public async getAllSongModel(this: SongDAO): Promise<SongDocument[]> {
    return await songModel.find()
      .populate<Pick<Song, "albumV2">>("albumV2")
      .populate<Pick<Song, "artists">>("artists")
      .catch((err) => {
        throw new DAOException(__filename, "getAllSongModel", err);
      });
  }

  public async getSongModel(this: SongDAO, id: string): Promise<SongDocument> {
    return await songModel.findById(id)
      .populate<Pick<Song, "albumV2">>("albumV2")
      .populate<Pick<Song, "artists">>("artists")
      .catch((err) => {
        throw new DAOException(__filename, "getSongModel", err);
      });
  }

  public async updateSongModel(this: SongDAO, song: Song): Promise<void> {
    await songModel.findByIdAndUpdate(song.id, mapSongDb(song))
      .catch((err) => {
        throw new DAOException(__filename, "updateSongModel", err);
      });
  }

  public async createSongModel(this: SongDAO, song: Song): Promise<string> {
    return await songModel
      .create(mapSongDb(song))
      .then((s) => s.id)
      .catch((err) => {
        throw new DAOException(__filename, "createSongModel", err);
      });
  }

  public async findSongModelByPath(this: SongDAO, path: string): Promise<SongDocument> {
    return await songModel
      .find({ path })
      .populate<Pick<Song, "albumV2">>("albumV2")
      .populate<Pick<Song, "artists">>("artists")
      .then((s) => s[0])
      .catch((err) => {
        throw new DAOException(__filename, "findSongModelByPath", err);
      });
  }

  public async getPathsFromAllSong(this: SongDAO): Promise<string[]> {
    return await songModel
      .find({}, { path: 1 })
      .then((s) => s.map((s) => s.path))
      .catch((err) => {
        throw new DAOException(__filename, "getPathsFromAllSong", err);
      });
  }

  public async getMbidlessSongModel(this: SongDAO): Promise<SongDocument[]> {
    return await songModel.find({
      mbid: { $exists: false }
    })
      .populate<Pick<Song, "albumV2">>("albumV2")
      .populate<Pick<Song, "artists">>("artists")
      .catch((err) => {
        throw new DAOException(__filename, "getMbidlessSongModel", err);
      });
  }

  public async getSongModelForMetadataGrabber(this: SongDAO): Promise<SongDocument[]> {
    return await songModel
      .find({
        $or: [
          { lastUpdated: { $lt: Date.now() - UPDATE_METADATA_PERIOD } },
          { lastUpdated: { $exists: false } }
        ],
      })
      .populate<Pick<Song, "albumV2">>("albumV2")
      .populate<Pick<Song, "artists">>("artists")
      .catch((err) => {
        throw new DAOException(__filename, "getSongModelForMetadataGrabber", err);
      });
  }
}

export const songDAO = new SongDAO();
