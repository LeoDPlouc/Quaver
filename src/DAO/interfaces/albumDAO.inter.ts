// Quaver is a self-hostable music player and music library manager
// Copyright (C) 2024 DPlouc
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

import { SongDocument } from "../songDAO";
import { AlbumDocument } from "../albumDAO";
import { Album } from "../../models/album";

export const AlbumDAOToken = Symbol("AlbumDAO");

export interface AlbumDAO {
  getAllAlbumModel(this: AlbumDAO): Promise<AlbumDocument[]>

  getAlbumModel(this: AlbumDAO, id: string): Promise<AlbumDocument>

  getSongModelFromAlbum(this: AlbumDAO, id: string): Promise<SongDocument[]>

  createAlbumModel(this: AlbumDAO, album: Album): Promise<string>

  findAlbumModelByName(this: AlbumDAO, albumTitle: string, artistName?: string)

  updateAlbumModel(this: AlbumDAO, album: Album): Promise<void>

  getAlbumModelToCoverGrab(this: AlbumDAO): Promise<AlbumDocument[]>

  findAlbumsByMbid(this: AlbumDAO, mbid: string): Promise<AlbumDocument[]>

  getAlbumModelForMetadataGrabber(this: AlbumDAO): Promise<AlbumDocument[]>
}

