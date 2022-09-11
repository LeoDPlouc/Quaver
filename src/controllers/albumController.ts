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
import { mapAlbumDTO } from "../mappers/albumMapper";
import { mapSongDTO } from "../mappers/songMapper";
import { albumService } from "../service/albumService";
import { logger } from "../utils/logger";
import { ControllerException } from "./exceptions/controllerException";

export async function getAllAlbumsCtrl(req: Request, res: Response) {
  try {
    var result = await albumService.getAllAlbums();
  } catch (err) {
    logger.error(new ControllerException(__filename, "getAllAlbumsCtrl", err));

    res.json({
      status: "fail",
      statusCode: 1,
      errorMessage: "Server error",
    });
    return;
  }

  //Search all albums in the db and clean the output
  const albums = result.map(mapAlbumDTO);

  res.json({
    status: "success",
    statusCode: 0,
    results: albums.length,
    data: {
      albums,
    },
  });
}

export async function getAlbumCtrl(req: Request, res: Response) {
  let err = validationResult(req);
  if (!err.isEmpty()) {
    res.json({
      status: "fail",
      statusCode: 2,
      errorMessage: "Invalid request",
    });
    return;
  }

  //Search an album by id and clean the output
  try {
    var result = await albumService.getAlbum(req.params.id);
  } catch (err) {
    logger.error(new ControllerException(__filename, "getAlbumCtrl", err));

    res.json({
      status: "fail",
      statusCode: 1,
      errorMessage: "Server error",
    });
    return;
  }

  const album = mapAlbumDTO(result);

  res.json({
    status: "success",
    statusCode: 0,
    data: {
      album,
    },
  });
}

export async function getAlbumSongsCtrl(req: Request, res: Response) {
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
    var result = await albumService.getAlbumSongs(req.params.id);
  } catch (err) {
    logger.error(new ControllerException(__filename, "getAlbumSongsCtrl", err));
    res.json({
      status: "fail",
      statusCode: 1,
      errorMessage: "Server error",
    });
    return;
  }

  //Search songs by albumid in the db and clean the output
  const songs = result.map(mapSongDTO);

  res.json({
    status: "success",
    results: songs.length,
    statusCode: 0,
    data: {
      songs: songs,
    },
  });
}
