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
import { mapArtistDTO } from "../mappers/artistMapper";
import { mapSongDTO } from "../mappers/songMapper";
import { mapAlbumDTO } from "../mappers/albumMapper";
import { logger } from "../utils/logger";
import { artistService } from "../service/artistService";
import { ControllerException } from "./exceptions/controllerException";

export async function getAllArtist(req: Request, res: Response) {
  try {
    var result = await artistService.getAllArtist();
  } catch (err) {
    logger.error(new ControllerException(__filename, "getAllArtist", err));
    res.json({
      statusCode: 1,
      errorMessage: "Server error",
      status: "fail",
    });
    return;
  }

  //Search all artists in the db and clean the output
  const artists = result.map(mapArtistDTO);

  res.json({
    status: "success",
    statusCode: 0,
    results: artists.length,
    data: {
      artists,
    },
  });
}

export async function getArtistById(req: Request, res: Response) {
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
    var result = await artistService.getArtist(req.params.id);
  } catch (err) {
    logger.error(new ControllerException(__filename, "getArtistById", err));
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

export async function getSongFromArtistById(req: Request, res: Response) {
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
    var result = await artistService.getSongFromArtist(req.params.id);
  } catch (err) {
    logger.error(new ControllerException(__filename, "getSongFromArtistById", err));
    res.json({
      status: "fail",
      statusCode: 1,
      errorMessage: "Server error",
    });
    return;
  }

  //Search songs by artistId and clean the output
  const songs = result.map(mapSongDTO);

  res.json({
    status: "success",
    statusCode: 0,
    results: songs.length,
    data: {
      songs: songs,
    },
  });
}

export async function getAlbumFromArtistById(req: Request, res: Response) {
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
    var result = await artistService.getAlbumFromArtist(req.params.id);
  } catch (err) {
    logger.error(new ControllerException(__filename, "getAlbumFromArtistById", err));
    res.json({
      status: "fail",
      statusCode: 1,
      errorMessage: "Server error",
    });
    return;
  }

  //Search albums by artistId and clean the output
  const albums = result.map(mapAlbumDTO);

  res.json({
    status: "success",
    statusCode: 0,
    results: albums.length,
    data: {
      albums: albums,
    },
  });
}
