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

@injectable()
export class CleanFilesWithoutImageTask {
  public async doTask() {
    return await this.getData()
      .then(async data => {
        for (let i = 0; i < data.files.length; i++) {
          if (!this.hasFileImage(data.coverFiles, data.files[i])) {
            await this.deleteImageFile(data.files[i])
          }
        }
      })
      .catch(err => {
        this.logger.error(new CoverCleanerException(__filename, "cleanFilesWithoutImage", err));
      })
  }

  private async getData() {
    let coverFiles = await this.imageService
      .getAllImages()
      .then((result) => result.map((i) => [i.large, i.medium, i.path, i.small, i.tiny, i.verylarge]))
      .then((result) => result.reduce((tab1, tab2) => [...tab1, ...tab2], []))
      .then((result) => result.filter((p) => p));
    let files = await this.fileService.getAllFiles(this.pathService.getImagesPath());

    return { coverFiles, files }
  }

  private hasFileImage(coverFiles: string[], imageFile: string) {
    return coverFiles.find((p) => p == imageFile)
  }

  private async deleteImageFile(imageFile: string) {
    await this.imageService.deleteImageFile(imageFile);
    this.logger.info(`Deleted cover ${imageFile}`, "Cover Cleaner");
  }

  constructor(
    private imageService: ImageService,
    private fileService: FileService,
    private logger: Logger,
    private pathService: PathService
  ) { }
}