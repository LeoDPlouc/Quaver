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
import { mapArtist, mapArtistDb } from "../mappers/artistMapper";
import { mapSong } from "../mappers/songMapper";
import { NotFoundException } from "../utils/exceptions/notFoundException";
import { logger } from "../utils/logger";
import { ServiceException } from "./exceptions/serviceException";

class ArtistService {
  public async getAllArtists(this: ArtistService): Promise<Artist[]> {
    return await artistDAO
      .getAllArtistModels()
      .then((result) => result.map(mapArtist))
      .catch((err) => {
        throw new ServiceException(__filename, "getAllArtists", err);
      });
  }

  public async getArtist(this: ArtistService, id: string): Promise<Artist> {
    let result = await artistDAO.getArtistModel(id).catch((err) => {
      throw new ServiceException(__filename, "getArtist", err);
    });

    if (!result) {
      throw new NotFoundException(__filename, "getArtist", "Artist not found");
    }

    return mapArtist(result);
  }

  public async getArtistSongs(this: ArtistService, id: string): Promise<Song[]> {
    return await artistDAO
      .getArtistSongModels(id)
      .then((result) => result.map(mapSong))
      .catch((err) => {
        throw new ServiceException(__filename, "getArtistSongs", err);
      });
  }

  public async getArtistAlbums(id: string): Promise<Album[]> {
    let result = await artistDAO.getArtistAlbumModels(id).catch((err) => {
      throw new ServiceException(__filename, "getArtistAlbums", err);
    });

    if (!result) {
      throw new NotFoundException(__filename, "getArtistAlbums", "Artist not found");
    }

    return result.map(mapAlbum);
  }

  public async createArtist(this: ArtistService, artist: Artist): Promise<string> {
    return await artistDAO.createArtistModel(artist)
      .catch((err) => {
        throw new ServiceException(__filename, "createArtist", err);
      });
  }

  public async findArtistByName(this: ArtistService, name: string): Promise<Artist[]> {
    return await artistDAO
      .findArtistModelByName(name)
      .then((result) => result.map(mapArtist))
      .catch((err) => {
        throw new ServiceException(__filename, "findArtistByName", err);
      });
  }

  public async updateArtist(artist: Artist): Promise<void> {
    return await artistDAO.updateArtistModel(artist)
      .catch((err) => {
        throw new ServiceException(__filename, "updateArtist", err);
      });
  }

  public async getArtistsByMbidOrCreate(this: ArtistService, mbids: string[]): Promise<Artist[]> {
    let artists = await artistDAO.findArtistsByMbids(mbids)
      .then(results => results.map(mapArtist))
      .catch((err) => {
        throw new ServiceException(__filename, "getArtistsByMbidOrCreate", err);
      });

    let notFoundMbids = mbids.filter(id => !artists.find(a => a.mbid == id))

    for (let i = 0; i < notFoundMbids.length; i++) {
      let id = await this.createArtist({ mbid: notFoundMbids[i] })
      logger.info(`Found new artist ${id}`, "Artist Service")
      artists.push({ id, mbid: notFoundMbids[i] })
    }
    return artists
  }
}

export const artistService = new ArtistService();
