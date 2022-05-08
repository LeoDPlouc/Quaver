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

import fs from "fs/promises";
import path from "path";
import mm from "mime-types";
import { MUSIC_PATH } from "../config/config";
import { connectToDb } from "../access/database/utils";
import { createSong, getAllSongPaths } from "../service/songService";
import { getMetadataFromFile } from "../access/file/songFile";
import {
  createAlbum,
  getAllAlbums,
  updateAlbum,
} from "../service/albumService";
import { createArtist, getAllArtists } from "../service/artistService";
import { createFailure, Failable, Failure } from "../utils/Failable";
import { logError, logInfo, setWorkerName } from "../utils/logger";

let songPaths: string[];
let artists: Artist[];
let albums: Album[];

async function collect(libPath: string) {
  try {
    var paths = await fs.readdir(libPath, { withFileTypes: true });
  } catch (err) {
    logError(createFailure(err, __filename, collect.name));
  }

  for (var i = 0; i < paths.length; i++) {
    var fullPath = path.join(libPath, paths[i].name);

    if (paths[i].isDirectory()) await collect(fullPath);

    if (paths[i].isFile())
      await registerSong(path.resolve(fullPath)).catch(() => {});
  }
}

async function registerSong(songPath: string) {
  //Only considere audio files
  if (!mm.lookup(path.extname(songPath)).match("audio")) return;

  //If the song doesn't already exist, extract its metadata and create a new song
  if (songPaths.find((p) => p == songPath)) return;

  let metadataResult = await getMetadataFromFile(songPath);
  if (metadataResult.failure) {
    logError(metadataResult.failure);
    return;
  }
  let song = metadataResult.result;

  logInfo(`Found new song ${song.path}`);

  //Fetch the song's album
  let album = findAlbumByName(song.album, song.artist);
  let albumId = album?.id;
  if (!album) {
    album = { artist: song.artist, title: song.album, year: song.year };

    let albumIdResult = await createAlbum(album);
    if (albumIdResult.failure) {
      logError(albumIdResult.failure);
      return;
    }
    albumId = albumIdResult.result;

    logInfo(`Found new album ${album.title}`);

    let failure = (await updateAlbums()).failure;
    if (failure) {
      logError(failure);
      return;
    }
  }

  //Fetch the song's artist
  let artist = findArtistByName(song.artist);
  let artistId = artist?.id;
  if (!artist) {
    artist = { name: song.artist };

    let artistIdResult = await createArtist(artist);
    if (artistIdResult.failure) {
      logError(artistIdResult.failure);
      return;
    }
    artistId = artistIdResult.result;

    logInfo(`Found new artist ${artist.name}`);

    let failure = (await updateArtists()).failure;
    if (failure) {
      logError(failure);
      return;
    }
  }

  album.artistId = artistId;
  await updateAlbum(album);

  song.artistId = artistId;
  song.albumId = albumId;
  await createSong(song);
}

async function updatePaths(): Promise<Failable<null>> {
  let result = await getAllSongPaths();

  if (result.failure) {
    return {
      failure: createFailure(
        "Service error",
        __filename,
        updatePaths.name,
        result.failure
      ),
    };
  }

  songPaths = result.result;

  return {};
}

async function updateAlbums(): Promise<Failable<null>> {
  let result = await getAllAlbums();

  if (result.failure) {
    return {
      failure: createFailure(
        "Service error",
        __filename,
        updateAlbums.name,
        result.failure
      ),
    };
  }

  albums = result.result;

  return {};
}

async function updateArtists(): Promise<Failable<null>> {
  let result = await getAllArtists();

  if (result.failure) {
    return {
      failure: createFailure(
        "Service error",
        __filename,
        updateArtists.name,
        result.failure
      ),
    };
  }

  artists = result.result;

  return {};
}

function findArtistByName(artist: string): Artist {
  return artists.find((a) => a.name == artist);
}

function findAlbumByName(album: string, artist: string) {
  if (artist) {
    return albums.find((a) => a.title == album && a.artist == artist);
  } else {
    return albums.find((a) => a.title == album);
  }
}

function doWork() {
  setWorkerName("SongCollector");
  logInfo("Song collection Started");

  connectToDb().then(async () => {
    //Collection run in background and is relaunched every 30 sec
    while (true) {
      if (
        !(await updatePaths()).failure &&
        !(await updateAlbums()).failure &&
        !(await updateArtists()).failure
      ) {
        await collect(MUSIC_PATH).catch();
      }
      await new Promise((resolve) => setTimeout(resolve, 30000));
    }
  });
}

doWork();
