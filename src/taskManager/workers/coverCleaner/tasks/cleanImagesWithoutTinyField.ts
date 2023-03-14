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

@injectable()
export class CleanImagesWithoutTinyFieldTask {
  public async doTask() {
    return await this.imageService.getTinyLessImage()
      .then(async data => {
        for (let i = 0; i < data.length; i++) {
          await this.imageService.deleteImageModel(data[i].id)
        }
      })
      .catch(err => {
        throw new CoverCleanerException(__filename, "cleanImagesWthoutTinyField", err);
      })
  }

  constructor(private imageService: ImageService) { }
}