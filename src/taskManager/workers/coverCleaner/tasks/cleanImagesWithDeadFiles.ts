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
import { PathService } from "../../../../service/pathService";
import { Image } from "../../../../models/image";

@injectable()
export class CleanImagesWithDeadFilesTask {
  public async doTask() {
    return await this.fetchData()
      .then(async data => {
        for (let i = 0; i < data.images.length; i++) {
          if (this.isImageFileDead(data.images[i], data.files)) {
            await this.deleteFile(data.images[i])
          }
        }
      })
      .catch((err) => {
        throw new CoverCleanerException(__filename, "cleanImagesWithDeadFiles", err);
      })
  }

  private async fetchData() {
    let images = await this.imageService.getAllImages();
    let files = await this.fileService.getAllFiles(this.pathService.getImagesPath());

    return { images, files }
  }

  private isImageFileDead(image: Image, files: string[]) {
    return ![image.large, image.medium, image.small, image.verylarge]
      .filter((i) => !!i)
      .map((i) => !!files.find((f) => f == i))
      .reduce((prev, cur) => prev && cur, true);
  }

  private async deleteFile(image: Image) {
    this.imageService.deleteImageModel(image.id);
    this.logger.info(`Deleted image ${image.id}`, "Cover Cleaner");
  }

  constructor(
    private imageService: ImageService,
    private fileService: FileService,
    private logger: Logger,
    private pathService: PathService
  ) { }
}