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
  id: string;
  title: string;
  n: number;
  artist: string;
  album: string;
  year: number;
  duration: number;
  like: number;
  albumId: string;
  format: string;

  constructor(
    id: string,
    title: string,
    n: number,
    artist: string,
    album: string,
    year: number,
    duration: number,
    like: number,
    albumId: string,
    format: string
  ) {
    this.id = id;
    this.title = title;
    this.n = n;
    this.artist = artist;
    this.album = album;
    this.year = year;
    this.duration = duration;
    this.like = like;
    this.albumId = albumId;
    this.format = format;
  }
}

export class Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  cover: string;
  year: string;

  constructor(
    id: string,
    title: string,
    artist: string,
    artistId: string,
    cover: string,
    year: string
  ) {
    this.id = id;
    this.title = title;
    this.artist = artist;
    this.artistId = artistId;
    this.cover = cover;
    this.year = year;
  }
}

export class Artist {
  id: string;
  name: string;
  cover: string;

  constructor(id: string, name: string, cover: string) {
    this.id = id;
    this.name = name;
    this.cover = cover;
  }
}

export enum ImageSize {
  tiny = "tiny",
  small = "small",
  medium = "medium",
  large = "large",
  verylarge = "veryLarge",
}
