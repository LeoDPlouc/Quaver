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
import { createFailure } from "../utils/Failure";

class SongService {
  public async getAllSongs(this: SongService): Promise<Song[]> {
    try {
      var result = await songDAO.getAllSongModels();
    } catch (err) {
      throw createFailure("DAO error", __filename, this.getAllSongs.name, err);
    }

    return result.map((s) => mapSong(s));
  }

  public async getSong(this: SongService, id: string): Promise<Song> {
    try {
      var result = await songDAO.getSongModel(id);
    } catch (err) {
      throw createFailure("DAO error", __filename, this.getSong.name, err);
    }

    if (!result) {
      throw createFailure("Invalid Id", __filename, this.getSong.name);
    }

    return mapSong(result);
  }

  public async updateSong(this: SongService, song: Song): Promise<void> {
    try {
      var result = await songDAO.updateSongModel(song);
    } catch (err) {
      throw createFailure("DAO error", __filename, this.updateSong.name, err);
    }
  }

  public async createSong(this: SongService, song: Song): Promise<string> {
    try {
      var result = await songDAO.createSongModel(song);
    } catch (err) {
      throw createFailure("DAO error", __filename, this.createSong.name, err);
    }

    return result;
  }

  public async findSongByPath(this: SongService, path: string): Promise<Song> {
    try {
      var result = await songDAO.findSongModelByPath(path);
    } catch (err) {
      throw createFailure(
        "DAO error",
        __filename,
        this.findSongByPath.name,
        err
      );
    }

    if (!result) {
      throw createFailure(
        "No song at path " + path,
        __filename,
        this.findSongByPath.name
      );
    }

    return mapSong(result);
  }

  public async getAllSongPaths(this: SongService): Promise<string[]> {
    try {
      var result = await songDAO.getAllSongModelPaths();
    } catch (err) {
      throw createFailure(
        "DAO error",
        __filename,
        this.getAllSongPaths.name,
        err
      );
    }

    return result;
  }

  public async getMetadataFromFile(
    this: SongService,
    songPath: string
  ): Promise<Song> {
    try {
      return await songFileAccess.getMetadataFromFile(songPath);
    } catch (err) {
      throw createFailure(
        "File access error",
        this.getMetadataFromFile.name,
        __filename,
        err
      );
    }
  }
}

export const songService = new SongService();
