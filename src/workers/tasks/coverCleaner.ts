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

import { IMAGES_PATH } from "../../config/config";
import { albumService } from "../../service/albumService";
import { fileService } from "../../service/fileService";
import { imageService } from "../../service/imageService";
import { createFailure } from "../../utils/Failure";
import { logger } from "../../utils/logger";

async function cleanAlbumlessImages() {
  try {
    var images = await imageService.getAllImages();
    var albums = await albumService.getAllAlbums();
  } catch (err) {
    throw createFailure("DAO error", __filename, "cleanAlbumlessImages", err);
  }

  for (let i = 0; i < images.length; i++) {
    if (!albums.find((a) => a.cover == images[i].id)) {
      try {
        await imageService.deleteImageModel(images[i].id);
        logger.info(`Deleted image ${images[i].id}`, "Cover Cleaner");
      } catch (err) {
        logger.error("DAO error", __filename, "cleanAlbumlessImages", err);
      }
    }
  }
}

async function cleanTinyLessFiles() {
  try {
    var images = await imageService.getAllImages();
    var files = await fileService.getAllFiles(IMAGES_PATH);
  } catch (err) {
    logger.error("Cover cleaner error", __filename, "cleanTinyLessFiles", err);
  }

  for (let i = 0; i < images.length; i++) {
    if (!files.find((f) => f == images[i].tiny)) {
      try {
        imageService.deleteImageModel(images[i].id);
        logger.info(`Deleted cover ${files[i]}`, "Cover Cleaner");
      } catch (err) {
        logger.error("Cover cleaner error", __filename, "cleanTinyLessFiles", err);
      }
    }
  }
}

async function cleanTinylessImages() {
  var images = await imageService.getTinyLessImage().catch((err) => {
    throw createFailure("DAO err", __filename, "cleanTinylessImages", err);
  });

  for (let i = 0; i < images.length; i++) {
    await imageService.deleteImageModel(images[i].id).catch((err) => {
      logger.error("DAO error", __filename, "cleanTinylessImages", err);
    });
  }
}

async function cleanImageLessFiles() {
  try {
    var coverFiles = await imageService
      .getAllImages()
      .then((result) => result.map((i) => [i.large, i.medium, i.path, i.small, i.tiny, i.verylarge]))
      .then((result) => result.reduce((tab1, tab2) => [...tab1, ...tab2], []))
      .then((result) => result.filter((p) => p));
    var files = await fileService.getAllFiles(IMAGES_PATH);
  } catch (err) {
    logger.error("Cover cleaner error", __filename, "cleanImageLessFiles", err);
  }

  for (let i = 0; i < files.length; i++) {
    if (!coverFiles.find((p) => p == files[i])) {
      try {
        await imageService.deleteImageFile(files[i]);
        logger.info(`Deleted cover ${files[i]}`, "Cover Cleaner");
      } catch (err) {
        logger.error("Cover cleaner error", __filename, "cleanImageLessFiles", err);
      }
    }
  }
}

async function cleanAlbumCoverId() {
  try {
    var images = await imageService.getAllImages();
    var albums = await albumService.getAllAlbums();
  } catch (err) {
    throw createFailure("DAO error", __filename, "cleanAlbumlessImages", err);
  }

  try {
    for (let i = 0; i < albums.length; i++) {
      if (albums[i].cover && !images.find((im) => im.id == albums[i].cover)) {
        albums[i].cover = null;
        await albumService.updateAlbum(albums[i]);
        logger.info(`Clean cover id for ${albums[i].id}`, "Cover Cleaner");
      }
    }
  } catch (err) {
    logger.error("Cover cleaner error", __filename, "cleanAlbumCoverId", err);
  }
}

async function cleanDeadFiles() {
  try {
    var images = await imageService.getAllImages();
    var files = await fileService.getAllFiles(IMAGES_PATH);
  } catch (err) {
    throw createFailure("DAO err", __filename, "cleanTinylessImages", err);
  }

  try {
    for (let i = 0; i < images.length; i++) {
      let isDead = ![images[i].large, images[i].medium, images[i].small, images[i].verylarge]
        .filter((i) => !!i)
        .map((i) => !!files.find((f) => f == i))
        .reduce((prev, cur) => prev && cur, true);

      if (isDead) {
        imageService.deleteImageModel(images[i].id);
        logger.info(`Deleted image ${images[i].id}`, "Cover Cleaner");
      }
    }
  } catch (err) {
    logger.error("Cover cleaner error", __filename, "cleanDeadFiles", err);
  }
}

export default async function doWork() {
  logger.info("Cover cleaner started", "Cover Cleaner");

  try {
    await cleanAlbumlessImages();
    await cleanTinyLessFiles();
    await cleanDeadFiles();
    await cleanTinylessImages();
    await cleanImageLessFiles();
    await cleanAlbumCoverId();
  } catch (err) {
    logger.error("Cover cleaner error", __filename, "doWork", err);
  }
}
