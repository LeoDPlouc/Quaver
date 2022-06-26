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

import { artistDAO } from "../access/database/artistDAO";
import { mapAlbum } from "../mappers/albumMapper";
import { mapArtist } from "../mappers/artistMapper";
import { mapSong } from "../mappers/songMapper";
import { createFailure } from "../utils/Failure";

class ArtistService {
  public async getAllArtists(this: ArtistService): Promise<Artist[]> {
    try {
      var result = await artistDAO.getAllArtistModels();
    } catch (err) {
      throw createFailure(
        "DAO error",
        __filename,
        this.getAllArtists.name,
        err
      );
    }

    return result.map((a) => mapArtist(a));
  }

  public async getArtist(this: ArtistService, id: string): Promise<Artist> {
    try {
      var result = await artistDAO.getArtistModel(id);
    } catch (err) {
      throw createFailure("DAO error", __filename, this.getArtist.name, err);
    }

    if (!result) {
      throw createFailure("Invalid Id", __filename, this.getArtist.name);
    }

    return mapArtist(result);
  }

  public async getArtistSongs(
    this: ArtistService,
    id: string
  ): Promise<Song[]> {
    try {
      var result = await artistDAO.getArtistSongModels(id);
    } catch (err) {
      throw createFailure(
        "DAO error",
        __filename,
        this.getArtistSongs.name,
        err
      );
    }

    return result.map((s) => mapSong(s));
  }

  public async getArtistAlbums(id: string): Promise<Album[]> {
    try {
      var result = await artistDAO.getArtistAlbumModels(id);
    } catch (err) {
      throw createFailure(
        "DAO error",
        __filename,
        this.getArtistAlbums.name,
        err
      );
    }

    return result.map((a) => mapAlbum(a));
  }

  public async createArtist(
    this: ArtistService,
    artist: Artist
  ): Promise<string> {
    try {
      var result = await artistDAO.createArtistModel(artist);
    } catch (err) {
      throw createFailure("DAO error", __filename, this.createArtist.name, err);
    }

    return result;
  }

  public async findArtistByName(
    this: ArtistService,
    name: string
  ): Promise<Artist[]> {
    try {
      var result = await artistDAO.findArtistModelByName(name);
    } catch (err) {
      throw createFailure(
        "DAO error",
        __filename,
        this.findArtistByName.name,
        err
      );
    }

    return result.map((a) => mapArtist(a));
  }

  public async updateArtist(artist: Artist): Promise<void> {
    try {
      await artistDAO.updateArtistModel(artist);
    } catch (err) {
      throw createFailure("DAO error", __filename, this.updateArtist.name, err);
    }
  }
}

export const artistService = new ArtistService();
