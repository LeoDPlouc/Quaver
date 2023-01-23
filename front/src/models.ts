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

export class Song {
  id: string
  title: string
  n: number
  duration: number
  like: number
  artist: string // DEPRECATED
  artistId: string // DEPRECATED
  album: string // DEPRECATED
  albumId: string // DEPRECATED
  artists: Artist[]
  albumV2: Album
  year: number
  format: string
  joinings: Joining[]
}

export class Album {
  id: string
  title: string
  artist: string // DEPRECATED
  artists: Artist[]
  artistId: string // DEPRECATED
  coverV2: Image
  cover: string // DEPRECATED
  year: number
  joinings: Joining[]
}

export class Artist {
  id: string
  name: string
  cover: string // DEPRECATED
  coverV2: Image
}

export class Image {
  id: string
}

export class Joining {
  mbid: string
  joinphrase: string
}

export enum ImageSize {
  tiny = "tiny",
  small = "small",
  medium = "medium",
  large = "large",
  verylarge = "veryLarge",
}
