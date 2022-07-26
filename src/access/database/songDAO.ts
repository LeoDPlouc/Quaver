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
import { songModel } from "./models/songModel";

class SongDAO {
  public async getAllSongModels(this: SongDAO): Promise<(Song & Document<any, any, Song>)[]> {
    return await songModel.find().catch((err) => {
      throw createFailure(err, __filename, this.getAllSongModels.name);
    });
  }

  public async getSongModel(this: SongDAO, id: string): Promise<Song & Document<any, any, Song>> {
    return await songModel.findById(id).catch((err) => {
      throw createFailure(err, __filename, this.getSongModel.name);
    });
  }

  public async updateSongModel(this: SongDAO, song: Song): Promise<void> {
    await songModel.findByIdAndUpdate(song.id, song).catch((err) => {
      throw createFailure(err, __filename, this.updateSongModel.name);
    });
  }

  public async createSongModel(this: SongDAO, song: Song): Promise<string> {
    return await songModel
      .create(song)
      .then((s) => s.id)
      .catch((err) => {
        throw createFailure(err, __filename, this.createSongModel.name);
      });
  }

  public async findSongModelByPath(this: SongDAO, path: string): Promise<Song & Document<any, any, Song>> {
    return await songModel
      .find({ path })
      .then((s) => s[0])
      .catch((err) => {
        throw createFailure(err, __filename, this.findSongModelByPath.name);
      });
  }

  public async getAllSongModelPaths(this: SongDAO): Promise<string[]> {
    return await songModel
      .find({}, { path: 1 })
      .then((s) => s.map((s) => s.path))
      .catch((err) => {
        throw createFailure(err, __filename, this.getAllSongModelPaths.name);
      });
  }
}

export const songDAO = new SongDAO();
