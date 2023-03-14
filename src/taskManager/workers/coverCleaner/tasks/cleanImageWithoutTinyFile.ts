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

import { injectable } from "tsyringe";
import { CoverCleanerException } from "../../exceptions/coverCleanerException";
import { ImageService } from "../../../../service/imageService";
import { FileService } from "../../../../service/fileService";
import { Logger } from "../../../../utils/logger";

@injectable()
export class CleanImageWithoutTinyFileTask {
  public async doTask() {
    return await this.getData()
      .then(async data => {
        for (let i = 0; i < data.images.length; i++) {
          if (!this.isTinyImageInFiles(data.files, data.images[i])) {
            await this.deleteImage(data.images[i], data.files[i])
          }
        }
      })
      .catch(err => {
        this.logger.error(new CoverCleanerException(__filename, "cleanImageWithoutTinyFile", err));
      })
  }

  private async getData() {
    let images = await this.imageService.getAllImages();
    let files = await this.fileService.getAllFiles(this.fileService.getImagesPath());

    return { images, files }
  }

  private isTinyImageInFiles(files: string[], image: Image) {
    return Boolean(files.find((f) => f == image.tiny))
  }

  private async deleteImage(image: Image, file: string) {
    await this.imageService.deleteImageModel(image.id);
    this.logger.info(`Deleted cover ${file}`, "Cover Cleaner");
  }

  constructor(
    private imageService: ImageService,
    private fileService: FileService,
    private logger: Logger
  ) { }
}