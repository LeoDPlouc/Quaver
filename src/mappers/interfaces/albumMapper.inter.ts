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

import { Document } from "mongoose";
import { Album } from "../../models/album";
import { AlbumDTO } from "../../controllers/DTO/albumDTO";
import { AlbumDb } from "../../DAO/models/interfaces/albumDb";

export const AlbumMapperToken = Symbol("AlbumMapper");

export interface AlbumMapper {

    toAlbum(data: Album & Document<any, any, Album>): Album;

    toAlbumDTO(data: Album): AlbumDTO;

    toAlbumDb(data: Album): AlbumDb;
}