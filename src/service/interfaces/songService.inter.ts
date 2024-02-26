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
import { SongMetadata } from "../DTO/songMetadata";

export const SongServiceToken = Symbol("SongService");

export interface SongService {
  getAllSong(): Promise<Song[]>;

  getSong(id: string): Promise<Song>;

  updateSong(song: Song): Promise<void>;

  createSong(song: Song): Promise<string>;

  findSongByPath(path: string): Promise<Song>;

  getPathsFromAllSong(): Promise<string[]>;

  fetchSongMBId(song: SongData): Promise<string>;

  getMbidlessSong(): Promise<Song[]>;

  getSongForMetadataGrabber(): Promise<Song[]>;

  fetchSongMetadata(song: Song): Promise<SongMetadata>;
}
