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
import { DAOException } from "./exceptions/DAOException";
import { albumModel } from "./models/albumModel";
import { artistModel } from "./models/artistModel";
import { songModel } from "./models/songModel";

class ArtistDAO {
  public async getAllArtistModels(this: ArtistDAO): Promise<(Artist & Document<any, any, Artist>)[]> {
    return await artistModel.find().catch((err) => {
      throw new DAOException(__filename, "getAllArtistModels", err);
    });
  }

  public async getArtistModel(this: ArtistDAO, id: string): Promise<Artist & Document<any, any, Artist>> {
    return await artistModel.findById(id).catch((err) => {
      throw new DAOException(__filename, "getArtistModel", err);
    });
  }

  public async getArtistSongModels(this: ArtistDAO, id: string): Promise<(Song & Document<any, any, Song>)[]> {
    return await songModel.find({ artistId: id }).catch((err) => {
      throw new DAOException(__filename, "getArtistSongModels", err);
    });
  }

  public async getArtistAlbumModels(this: ArtistDAO, id: string): Promise<(Album & Document<any, any, Album>)[]> {
    return await albumModel.find({ artistId: id }).catch((err) => {
      throw new DAOException(__filename, "getArtistAlbumModels", err);
    });
  }

  public async createArtistModel(this: ArtistDAO, artist: Artist): Promise<string> {
    return await artistModel
      .create(artist)
      .then((a) => a.id)
      .catch((err) => {
        throw new DAOException(__filename, "createArtistModel", err);
      });
  }

  public async findArtistModelByName(this: ArtistDAO, name: string): Promise<(Artist & Document<any, any, Artist>)[]> {
    return await artistModel.find({ name: name }).catch((err) => {
      throw new DAOException(__filename, "findArtistModelByName", err);
    });
  }

  public async updateArtistModel(this: ArtistDAO, artist: Artist): Promise<void> {
    await artistModel.findByIdAndUpdate(artist.id, artist).catch((err) => {
      throw new DAOException(__filename, "updateArtistModel", err);
    });
  }
}

export const artistDAO = new ArtistDAO();
