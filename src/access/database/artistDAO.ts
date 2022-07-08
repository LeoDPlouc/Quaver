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
import { artistModel } from "./models/artistModel";
import { songModel } from "./models/songModel";

class ArtistDAO {
  public async getAllArtistModels(
    this: ArtistDAO
  ): Promise<(Artist & Document<any, any, Artist>)[]> {
    try {
      return await artistModel.find();
    } catch (err) {
      throw createFailure(err, __filename, this.getAllArtistModels.name);
    }
  }

  public async getArtistModel(
    this: ArtistDAO,
    id: string
  ): Promise<Artist & Document<any, any, Artist>> {
    try {
      return await artistModel.findById(id);
    } catch (err) {
      throw createFailure(err, __filename, this.getArtistModel.name);
    }
  }

  public async getArtistSongModels(
    this: ArtistDAO,
    id: string
  ): Promise<(Song & Document<any, any, Song>)[]> {
    try {
      return await songModel.find({ artistId: id });
    } catch (err) {
      throw createFailure(err, __filename, this.getArtistSongModels.name);
    }
  }

  public async getArtistAlbumModels(
    this: ArtistDAO,
    id: string
  ): Promise<(Album & Document<any, any, Album>)[]> {
    try {
      return await albumModel.find({ artistId: id });
    } catch (err) {
      throw createFailure(err, __filename, this.getArtistAlbumModels.name);
    }
  }

  public async createArtistModel(
    this: ArtistDAO,
    artist: Artist
  ): Promise<string> {
    try {
      return (await artistModel.create(artist)).id;
    } catch (err) {
      throw createFailure(err, __filename, this.createArtistModel.name);
    }
  }

  public async findArtistModelByName(
    this: ArtistDAO,
    name: string
  ): Promise<(Artist & Document<any, any, Artist>)[]> {
    try {
      return await artistModel.find({ name: name });
    } catch (err) {
      throw createFailure(err, __filename, this.findArtistModelByName.name);
    }
  }

  public async updateArtistModel(
    this: ArtistDAO,
    artist: Artist
  ): Promise<void> {
    try {
      await artistModel.findByIdAndUpdate(artist.id, artist);
    } catch (err) {
      throw createFailure(err, __filename, this.updateArtistModel.name);
    }
  }
}

export const artistDAO = new ArtistDAO();
