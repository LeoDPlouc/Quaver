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
import { UPDATE_METADATA_PERIOD } from "../../config/appConfig";
import { DAOException } from "./exceptions/DAOException";
import { songModel } from "./models/songModel";

class SongDAO {
  public async getAllSongModels(this: SongDAO): Promise<(Song & Document<any, any, Song>)[]> {
    return await songModel.find()
      .populate<Pick<Song, "albumV2">>("albumObjectId")
      .populate<Pick<Song, "artistV2">>("artistObjectId")
      .catch((err) => {
        throw new DAOException(__filename, "getAllSongModels", err);
      });
  }

  public async getSongModel(this: SongDAO, id: string): Promise<Song & Document<any, any, Song>> {
    return await songModel.findById(id)
      .populate<Pick<Song, "albumV2">>("albumObjectId")
      .populate<Pick<Song, "artistV2">>("artistObjectId")
      .catch((err) => {
        throw new DAOException(__filename, "getSongModel", err);
      });
  }

  public async updateSongModel(this: SongDAO, song: Song): Promise<void> {
    await songModel.findByIdAndUpdate(song.id, song).catch((err) => {
      throw new DAOException(__filename, "updateSongModel", err);
    });
  }

  public async createSongModel(this: SongDAO, song: Song): Promise<string> {
    return await songModel
      .create(song)
      .then((s) => s.id)
      .catch((err) => {
        throw new DAOException(__filename, "createSongModel", err);
      });
  }

  public async findSongModelByPath(this: SongDAO, path: string): Promise<Song & Document<any, any, Song>> {
    return await songModel
      .find({ path })
      .populate<Pick<Song, "albumV2">>("albumObjectId")
      .populate<Pick<Song, "artistV2">>("artistObjectId")
      .then((s) => s[0])
      .catch((err) => {
        throw new DAOException(__filename, "findSongModelByPath", err);
      });
  }

  public async getAllSongModelPaths(this: SongDAO): Promise<string[]> {
    return await songModel
      .find({}, { path: 1 })
      .then((s) => s.map((s) => s.path))
      .catch((err) => {
        throw new DAOException(__filename, "getAllSongModelPaths", err);
      });
  }

  public async getMbidlessSongModels(this: SongDAO): Promise<(Song & Document<any, any, Song>)[]> {
    return await songModel.find({
      mbid: { $exists: false }
    })
      .populate<Pick<Song, "albumV2">>("albumObjectId")
      .populate<Pick<Song, "artistV2">>("artistObjectId")
      .catch((err) => {
        throw new DAOException(__filename, "getMbidlessSongModels", err);
      });
  }

  public async metadataGrabberGet(this: SongDAO): Promise<(Song & Document<any, any, Song>)[]> {
    return await songModel
      .find({
        $or: [
          { lastUpdated: { $lt: Date.now() - UPDATE_METADATA_PERIOD } },
          { lastUpdated: { $exists: false } }
        ],
      })
      .populate<Pick<Song, "albumV2">>("albumObjectId")
      .populate<Pick<Song, "artistV2">>("artistObjectId")
      .catch((err) => {
        throw new DAOException(__filename, "getUpdatableAlbumModels", err);
      });
  }
}

export const songDAO = new SongDAO();
