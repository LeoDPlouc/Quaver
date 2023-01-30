// Quaver is a self-hostable music player and music library manager
// Copyright (C) 2023  DPlouc
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

import { fileService } from "../../../../service/fileService";
import { imageService } from "../../../../service/imageService";
import { logger } from "../../../../utils/logger";
import { TaskException } from "../../exceptions/taskException";

export async function cleanFilesWithoutImage() {
    try {
      var coverFiles = await imageService
        .getAllImages()
        .then((result) => result.map((i) => [i.large, i.medium, i.path, i.small, i.tiny, i.verylarge]))
        .then((result) => result.reduce((tab1, tab2) => [...tab1, ...tab2], []))
        .then((result) => result.filter((p) => p));
      var files = await fileService.getAllFiles(fileService.getImagesPath());
    } catch (err) {
      logger.error(new TaskException(__filename, "cleanFilesWithoutImage", err));
    }
  
    for (let i = 0; i < files.length; i++) {
      if (!coverFiles.find((p) => p == files[i])) {
        try {
          await imageService.deleteImageFile(files[i]);
          logger.info(`Deleted cover ${files[i]}`, "Cover Cleaner");
        } catch (err) {
          logger.error(new TaskException(__filename, "cleanFilesWithoutImage", err));
        }
      }
    }
  }