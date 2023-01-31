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
import { CoverCleanerException } from "../../exceptions/coverCleanerException";
import { TaskException } from "../../exceptions/taskException";

export async function cleanImageWithoutTinyFile() {
    try {
      var images = await imageService.getAllImages();
      var files = await fileService.getAllFiles(fileService.getImagesPath());
    } catch (err) {
      logger.error(new CoverCleanerException(__filename, "cleanImageWithoutTinyFile", err));
    }
  
    for (let i = 0; i < images.length; i++) {
      if (!files.find((f) => f == images[i].tiny)) {
        try {
          imageService.deleteImageModel(images[i].id);
          logger.info(`Deleted cover ${files[i]}`, "Cover Cleaner");
        } catch (err) {
          logger.error(new CoverCleanerException(__filename, "cleanImageWithoutTinyFile", err));
        }
      }
    }
  }