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
import { mapImageDTO } from "../mappers/imageMapper";
import { logger } from "../utils/logger";
import { ImageSize } from "../models/imageSize";
import { imageService } from "../service/imageService";
import { ControllerException } from "./exceptions/controllerException";

export async function getAllImageInfo(req: Request, res: Response) {
  try {
    var result = await imageService.getAllImages();
  } catch (err) {
    logger.error(new ControllerException(__filename, "getAllImageInfo", err));
    res.json({
      status: "fail",
      statusCode: 1,
      errorMessage: "Server error",
    });
    return;
  }

  //Search all images in the db and clean the output
  const images = result.map(mapImageDTO);

  res.json({
    status: "success",
    statusCode: 0,
    results: images.length,
    data: {
      images,
    },
  });
}

export async function getImageInfoById(req: Request, res: Response) {
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
    var result = await imageService.getImage(req.params.id);
  } catch (err) {
    logger.error(new ControllerException(__filename, "getImageInfoById", err));
    res.json({
      status: "fail",
      statusCode: 1,
      errorMessage: "Server error",
    });
  }

  //Search an image by id and clean the output
  const image = mapImageDTO(result);

  res.json({
    status: "success",
    statusCode: 0,
    data: {
      image,
    },
  });
}


// DEPRECATED
export async function getImageFileById(req: Request, res: Response) {
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
    var result = await imageService.getImage(req.params.id);
  } catch (err) {
    logger.error(new ControllerException(__filename, "getImageFileById", err));
    res.json({
      status: "fail",
      statusCode: 1,
      errorMessage: "Server error",
    });
    return;
  }

  if (result.tiny) {
    res.sendFile(result.tiny);
  } else {
    res.sendFile(result.path);
  }
}

// DEPRECIATED - retirer le fallback sur path

export async function getImageFileWithSizeById(req: Request, res: Response) {
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
    var result = await imageService.getImage(req.params.id);
  } catch (err) {
    logger.error(new ControllerException(__filename, "getImageFileWithSizeById", err));
    res.json({
      status: "fail",
      statusCode: 1,
      errorMessage: "Server error",
    });
    return;
  }

  let size = req.params.size;

  // Refacto controllers : utiliser un switch

  if (size == ImageSize.verylarge) {
    if (result.verylarge) {
      res.sendFile(result.verylarge);
      return;
    } else {
      size = ImageSize.large;
    }
  }

  if (size == ImageSize.large) {
    if (result.large) {
      res.sendFile(result.large);
      return;
    } else {
      size = ImageSize.medium;
    }
  }

  if (size == ImageSize.medium) {
    if (result.medium) {
      res.sendFile(result.medium);
      return;
    } else {
      size = ImageSize.small;
    }
  }

  if (size == ImageSize.small) {
    if (result.small) {
      res.sendFile(result.small);
      return;
    } else {
      size = ImageSize.tiny;
    }
  }

  if (size == ImageSize.tiny && result.tiny) {
    res.sendFile(result.tiny);
    return;
  } else {
    res.sendFile(result.path);
  }
}
