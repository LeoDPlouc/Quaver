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

import { SongDb } from "../../DAO/models/interfaces/songDb";
import { SongDocument } from "../../DAO/songDAO";
import { SongDTO } from "../../controllers/DTO/songDTO";
import { Song } from "../../models/song";

export const SongMapperToken = Symbol("SongMapper");

export interface SongMapper {

    toSong(data: SongDocument): Song;

    toSongDTO(data: Song): SongDTO;

    toSongDb(data: Song): SongDb;
}