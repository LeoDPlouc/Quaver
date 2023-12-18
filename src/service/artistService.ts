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

import { injectable } from "tsyringe";
import { MusicBrainzApiAccess } from "../access/api/musicbrainz";
import { ArtistDAO } from "../access/database/artistDAO";
import { Album } from "../models/album";
import { Song } from "../models/song";
import { NotFoundException } from "../utils/exceptions/notFoundException";
import { ServiceException } from "./exceptions/serviceException";
import { AlbumMapper } from "../mappers/albumMapper";
import { SongMapper } from "../mappers/songMapper";
import { ArtistMapper } from "../mappers/artistMapper";
import { Logger } from "../utils/logger";
import { Artist } from "../models/artist";

@injectable()
export class ArtistService {
  public async getAllArtist(this: ArtistService): Promise<Artist[]> {
    return await this.artistDao
      .getAllArtistModel()
      .then((result) => result.map(this.artistMapper.toArtist))
      .catch((err) => {
        throw new ServiceException(__filename, "getAllArtist", err);
      });
  }

  public async getArtist(this: ArtistService, id: string): Promise<Artist> {
    let result = await this.artistDao.getArtistModel(id).catch((err) => {
      throw new ServiceException(__filename, "getArtist", err);
    });

    if (!result) {
      throw new NotFoundException(__filename, "getArtist", "Artist not found");
    }

    return this.artistMapper.toArtist(result);
  }

  public async getSongFromArtist(this: ArtistService, id: string): Promise<Song[]> {
    return await this.artistDao
      .getSongModelFromArtist(id)
      .then((result) => result.map(data => this.songMapper.toSong(data)))
      .catch((err) => {
        throw new ServiceException(__filename, "getSongFromArtist", err);
      });
  }

  public async getAlbumFromArtist(id: string): Promise<Album[]> {
    let result = await this.artistDao.getAlbumModelFromArtist(id).catch((err) => {
      throw new ServiceException(__filename, "getAlbumFromArtist", err);
    });

    if (!result) {
      throw new NotFoundException(__filename, "getAlbumFromArtist", "Artist not found");
    }

    return result.map(data => this.albumMapper.toAlbum(data));
  }

  public async createArtist(this: ArtistService, artist: Artist): Promise<string> {
    return await this.artistDao.createArtistModel(artist)
      .catch((err) => {
        throw new ServiceException(__filename, "createArtist", err);
      });
  }

  public async findArtistByName(this: ArtistService, name: string): Promise<Artist[]> {
    return await this.artistDao
      .findArtistModelByName(name)
      .then((result) => result.map(this.artistMapper.toArtist))
      .catch((err) => {
        throw new ServiceException(__filename, "findArtistByName", err);
      });
  }

  public async updateArtist(artist: Artist): Promise<void> {
    return await this.artistDao.updateArtistModel(artist)
      .catch((err) => {
        throw new ServiceException(__filename, "updateArtist", err);
      });
  }

  public async getArtistsByMbidOrCreate(this: ArtistService, mbids: string[]): Promise<Artist[]> {
    let artists = await this.artistDao.findArtistsByMbids(mbids)
      .then(results => results.map(this.artistMapper.toArtist))
      .catch((err) => {
        throw new ServiceException(__filename, "getArtistsByMbidOrCreate", err);
      });

    let notFoundMbids = mbids.filter(id => !artists.find(a => a.mbid == id))

    for (let i = 0; i < notFoundMbids.length; i++) {
      let id = await this.createArtist({ mbid: notFoundMbids[i] })
      this.logger.info(`Found new artist ${id}`, "Artist Service")
      artists.push({ id, mbid: notFoundMbids[i] })
    }
    return artists
  }

  public async getArtistForMetadataGrabber(this: ArtistService): Promise<Artist[]> {
    return await this.artistDao.getArtistModelForMetadataGrabber()
      .then(results => results.map(this.artistMapper.toArtist))
      .catch(err => {
        throw new ServiceException(__filename, "getArtistForMetadataGrabber", err)
      })
  }

  public async fetchArtistMetadata(this: ArtistService, artist: Artist): Promise<ArtistMetadata> {
    return await this.musicBrainzApiAccess.fetchArtistMetadata(artist.mbid).catch((err) => {
      throw new ServiceException(__filename, "fetchArtistMetadata", err)
    })
  }

  constructor(
    private musicBrainzApiAccess: MusicBrainzApiAccess,
    private artistDao: ArtistDAO,
    private albumMapper: AlbumMapper,
    private songMapper: SongMapper,
    private artistMapper: ArtistMapper,
    private logger: Logger
  ) { }
}
