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

export async function cleanImagesWithDeadFiles() {
    try {
      var images = await imageService.getAllImages();
      var files = await fileService.getAllFiles(fileService.getImagesPath());
    } catch (err) {
      throw new TaskException(__filename, "cleanImagesWithDeadFiles", err);
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
      logger.error(new TaskException(__filename, "cleanImagesWithDeadFiles", err));
    }
  }