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

import { songDAO } from "../access/database/songDAO";
import { songFileAccess } from "../access/file/songFile";
import { mapSong } from "../mappers/songMapper";
import { NotFoundException } from "../utils/exceptions/notFoundException";
import { ServiceException } from "./exceptions/serviceException";

class SongService {
  public async getAllSongs(this: SongService): Promise<Song[]> {
    return await songDAO
      .getAllSongModels()
      .then((result) => result.map(mapSong))
      .catch((err) => {
        throw new ServiceException(__filename, "getAllSongs", err);
      });
  }

  public async getSong(this: SongService, id: string): Promise<Song> {
    let result = await songDAO.getSongModel(id).catch((err) => {
      throw new ServiceException(__filename, "getSong", err);
    });

    if (!result) {
      throw new NotFoundException(__filename, "getSong", "Song not found");
    }

    return mapSong(result);
  }

  public async updateSong(this: SongService, song: Song): Promise<void> {
    await songDAO.updateSongModel(song).catch((err) => {
      throw new ServiceException(__filename, "updateSong", err);
    });
  }

  public async createSong(this: SongService, song: Song): Promise<string> {
    return await songDAO.createSongModel(song).catch((err) => {
      throw new ServiceException(__filename, "createSong", err);
    });
  }

  public async findSongByPath(this: SongService, path: string): Promise<Song> {
    let result = await songDAO.findSongModelByPath(path).catch((err) => {
      throw new ServiceException(__filename, "findSongByPath", err);
    });

    if (!result) {
      throw new NotFoundException(__filename, "findSongByPath", "Song not found");
    }

    return mapSong(result);
  }

  public async getAllSongPaths(this: SongService): Promise<string[]> {
    return await songDAO.getAllSongModelPaths().catch((err) => {
      throw new ServiceException(__filename, "getAllSongPaths", err);
    });
  }

  public async getMetadataFromFile(this: SongService, songPath: string): Promise<Song> {
    return await songFileAccess.getMetadataFromFile(songPath).catch((err) => {
      throw new ServiceException(__filename, "getMetadataFromFile", err);
    });
  }
}

export const songService = new SongService();
