// Quaver is a self-hostable music player and music library manager
// Copyright (C) 2024  DPlouc
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

import { Song } from "../../models/song";
import { SongDocument } from "../songDAO";

export const SongDAOToken = Symbol("SongDAO")

export interface SongDAO {
  getAllSongModel(this: SongDAO): Promise<SongDocument[]>;

  getSongModel(this: SongDAO, id: string): Promise<SongDocument>;

  updateSongModel(this: SongDAO, song: Song): Promise<void>;

  createSongModel(this: SongDAO, song: Song): Promise<string>;

  findSongModelByPath(this: SongDAO, path: string): Promise<SongDocument>;

  getPathsFromAllSong(this: SongDAO): Promise<string[]>;

  getMbidlessSongModel(this: SongDAO): Promise<SongDocument[]>;

  getSongModelForMetadataGrabber(this: SongDAO): Promise<SongDocument[]>;
}
