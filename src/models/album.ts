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

interface Album {
  id?: string;
  title?: string;
  artist?: string; // DEPRECATED
  artistId?: string; // DEPRECATED
  artistV2?: Artist
  coverV2?: Image
  cover?: string; // DEPRECATED
  year?: number;
  mbid?: string;
  mbids?: string[];
  lastUpdated?: number;
  lastCoverUpdate?: number;
}
