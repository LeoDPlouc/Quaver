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

import { Artist } from "../../models/artist";
import { AlbumDocument } from "../albumDAO";
import { ArtistDocument } from "../artistDAO";
import { SongDocument } from "../songDAO";

export const ArtistDAOToken = Symbol("ArtistDAO")

export interface ArtistDAO {
  getAllArtistModel(): Promise<ArtistDocument[]>;

  getArtistModel(id: string): Promise<ArtistDocument>;

  getSongModelFromArtist(id: string): Promise<SongDocument[]>;

  getAlbumModelFromArtist(id: string): Promise<AlbumDocument[]>;

  createArtistModel(artist: Artist): Promise<string>;

  findArtistModelByName(name: string): Promise<ArtistDocument[]>;

  updateArtistModel(artist: Artist): Promise<void>;

  findArtistsByMbids(mbids: string[]): Promise<ArtistDocument[]>;

  getArtistModelForMetadataGrabber(): Promise<ArtistDocument[]>;
}
