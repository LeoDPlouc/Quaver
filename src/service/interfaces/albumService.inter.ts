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

import { Album } from "../../models/album";
import { Song } from "../../models/song";
import { imageFileData } from "../DTO/ImageFileData";
import { AlbumMetadata } from "../DTO/albumMetadata";

export const AlbumServiceToken = Symbol("AlbumService");

export interface AlbumService {
  getAllAlbums(): Promise<Album[]>;

  getAlbum(id: string): Promise<Album>;

  getSongFromAlbum(id: string): Promise<Song[]>;

  createAlbum(album: Album): Promise<string>;

  findAlbumByName(albumTitle: string, artistName?: string): Promise<Album[]>;

  updateAlbum(album: Album): Promise<void>;

  getAlbumToCoverGrab(): Promise<Album[]>;

  fetchAlbumMetadata(album: Album): Promise<AlbumMetadata>;

  fetchAlbumCover(album: Album): Promise<imageFileData>;

  getAlbumByMbidOrCreate(mbid: string): Promise<Album>;

  getAlbumForMetadataGrabber(): Promise<Album[]>;
}
