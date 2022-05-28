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

import { Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  getAllArtists,
  getArtist,
  getArtistAlbums,
  getArtistSongs,
} from "../service/artistService";
import { mapArtistDTO } from "../mappers/artistMapper";
import { mapSongDTO } from "../mappers/songMapper";
import { mapAlbumDTO } from "../mappers/albumMapper";
import { logError } from "../utils/logger";

export async function getAllArtistsCtrl(req: Request, res: Response) {
  try {
    var result = await getAllArtists();
  } catch (err) {
    logError(err);
    res.json({
      statusCode: 1,
      errorMessage: "Server error",
      status: "fail",
    });
    return;
  }

  //Search all artists in the db and clean the output
  const artists = result.map((a) => mapArtistDTO(a));

  res.json({
    status: "success",
    statusCode: 0,
    results: artists.length,
    data: {
      artists,
    },
  });
}

export async function getOneArtistCtrl(req: Request, res: Response) {
  let err = validationResult(req);
  if (!err.isEmpty()) {
    res.json({
      status: "fail",
      statusCode: 2,
      errorMessage: "Invalid request",
    });
    return;
  }

  try {
    var result = await getArtist(req.params.id);
  } catch (err) {
    logError(err);
    res.json({
      status: "fail",
      statusCode: 1,
      errorMessage: "Server error",
    });
    return;
  }

  //Search an artist by id and clean the output
  const artist = mapArtistDTO(result);

  res.json({
    status: "success",
    statusCode: 0,
    data: {
      artist,
    },
  });
}

export async function getArtistSongsCtrl(req: Request, res: Response) {
  let err = validationResult(req);
  if (!err.isEmpty()) {
    res.json({
      status: "fail",
      statusCode: 2,
      errorMessage: "Invalid request",
    });
    return;
  }

  try {
    var result = await getArtistSongs(req.params.id);
  } catch (err) {
    logError(err);
    res.json({
      status: "fail",
      statusCode: 1,
      errorMessage: "Server error",
    });
    return;
  }

  //Search songs by artistId and clean the output
  const songs = result.map((s) => mapSongDTO(s));

  res.json({
    status: "success",
    statusCode: 0,
    results: songs.length,
    data: {
      songs: songs,
    },
  });
}

export async function getArtistAlbumsCtrl(req: Request, res: Response) {
  let err = validationResult(req);
  if (!err.isEmpty()) {
    res.json({
      status: "fail",
      statusCode: 2,
      errorMessage: "Invalid request",
    });
    return;
  }

  try {
    var result = await getArtistAlbums(req.params.id);
  } catch (err) {
    logError(err);
    res.json({
      status: "fail",
      statusCode: 1,
      errorMessage: "Server error",
    });
    return;
  }

  //Search albums by artistId and clean the output
  const albums = result.map((a) => mapAlbumDTO(a));

  res.json({
    status: "success",
    statusCode: 0,
    results: albums.length,
    data: {
      albums: albums,
    },
  });
}
