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
import { UPDATE_COVER_PERIOD, UPDATE_METADATA_PERIOD } from "../../config/appConfig";
import { DAOException } from "./exceptions/DAOException";
import { albumModel } from "./models/albumModel";
import { songModel } from "./models/songModel";

class AlbumDAO {
  public async getAllAlbumModels(this: AlbumDAO): Promise<(Album & Document<any, any, Album>)[]> {
    return await albumModel.find().catch((err) => {
      throw new DAOException(__filename, "getAllAlbumModels", err);
    });
  }

  public async getAlbumModel(this: AlbumDAO, id: string): Promise<Album & Document<any, any, Album>> {
    return await albumModel.findById(id).catch((err) => {
      throw new DAOException(__filename, "getAlbumModel", err);
    });
  }

  public async getAlbumSongModel(this: AlbumDAO, id: string): Promise<(Song & Document<any, any, Song>)[]> {
    return await songModel.find({ albumId: id }).catch((err) => {
      throw new DAOException(__filename, "getAlbumSongModel", err);
    });
  }

  public async createAlbumModel(this: AlbumDAO, album: Album): Promise<string> {
    return await albumModel
      .create(album)
      .then((a) => a.id)
      .catch((err) => {
        throw new DAOException(__filename, "createAlbumModel", err);
      });
  }

  public async findAlbumModelByName(this: AlbumDAO, albumTitle: string, artistName?: string): Promise<(Album & Document<any, any, Album>)[]> {
    var query: Album = { title: albumTitle };
    if (artistName) query.artist = artistName;

    return await albumModel.find(query).catch((err) => {
      throw new DAOException(__filename, "findAlbumModelByName", err);
    });
  }

  public async updateAlbumModel(this: AlbumDAO, album: Album): Promise<void> {
    await albumModel.findByIdAndUpdate(album.id, album).catch((err) => {
      throw new DAOException(__filename, "updateAlbumModel", err);
    });
  }

  public async getUpdatableAlbumModels(this: AlbumDAO): Promise<(Album & Document<any, any, Album>)[]> {
    return await albumModel
      .find({
        $or: [
          { lastUpdated: { $lt: Date.now() - UPDATE_METADATA_PERIOD } },
          { lastUpdated: { $exists: false } },
          { lastUpdated: null },
        ],
      })
      .catch((err) => {
        throw new DAOException(__filename, "getUpdatableAlbumModels", err);
      });
  }

  public async getToCoverGrabAlbumsModels(this: AlbumDAO): Promise<(Album & Document<any, any, Album>)[]> {
    return await albumModel
      .find({
        $or: [
          { cover: { $eq: null } },
          { lastCoverUpdate: null },
          { lastCoverUpdate: { $lt: Date.now() - UPDATE_COVER_PERIOD } },
        ],
      })
      .catch((err) => {
        throw new DAOException(__filename, "getToCoverGrabAlbumsModels", err);
      });
  }
}

export const albumDAO = new AlbumDAO();
