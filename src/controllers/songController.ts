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
import { SongService } from "../service/songService";
import { Logger } from "../utils/logger";
import { ControllerException } from "./exceptions/controllerException";
import { SongMapper } from "../mappers/songMapper";
import { container } from "tsyringe";

const songService = container.resolve(SongService)

const songMapper = container.resolve(SongMapper)

const logger = container.resolve(Logger)

export async function getAllSongInfo(req: Request, res: Response) {
  try {
    var result = await songService.getAllSong();
  } catch (err) {
    logger.error(new ControllerException(__filename, "getAllSongInfo", err));
    res.json({
      status: "fail",
      statusCode: 1,
      errorMessage: "Server error",
    });
    return;
  }

  //Search all songs in the db and clean the output
  const songs = result.map(data => songMapper.toSongDTO(data));

  res.json({
    status: "success",
    statusCode: 0,
    results: songs.length,
    data: {
      songs,
    },
  });
}

export async function getSongInfoById(req: Request, res: Response) {
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
    var result = await songService.getSong(req.params.id);
  } catch (err) {
    logger.error(new ControllerException(__filename, "getSongInfoById", err));
    res.json({
      status: "fail",
      statusCode: 1,
      errorMessage: "Server error",
    });
    return;
  }

  //Search a song by id and clean the output
  const song = songMapper.toSongDTO(result);

  res.json({
    status: "success",
    statusCode: 0,
    data: {
      song,
    },
  });
}

export async function getSongFileById(req: Request, res: Response) {
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
    var result = await songService.getSong(req.params.id);
  } catch (err) {
    logger.error(new ControllerException(__filename, "getSongFileById", err));
    res.json({
      status: "fail",
      statusCode: 1,
      errorMessage: "Server error",
    });
    return;
  }

  res.sendFile(result.path);
}

export async function updateLike(req: Request, res: Response) {
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
    var result = await songService.getSong(req.params.id);
  } catch (err) {
    logger.error(new ControllerException(__filename, "updateLike", err));
    res.json({
      status: "fail",
      statusCode: 1,
      errorMessage: "Server error",
    });
    return;
  }

  //Update the like field
  result.like = Number(req.body.like);
  songService.updateSong(result);

  res.json({
    status: "success",
    statusCode: 0,
  });
}
