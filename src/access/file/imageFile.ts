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

import { v4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import { FileSystemException } from "../../utils/exceptions/fileSystemException";
import { injectable } from "tsyringe";
import { FileService } from "../../service/fileService";
import { PathService } from "../../service/pathService";

@injectable()
export class ImageFileAccess {
  public async saveImageFileToDisk(this: ImageFileAccess, data: string, extension: string): Promise<string> {
    //Create an UUID for the name of the file
    let filename = v4() + extension;
    let p = path.resolve(this.pathService.getImagesPath(), filename);

    await fs.writeFile(p, data, { encoding: "binary" }).catch((err) => {
      throw new FileSystemException(__filename, "saveImageFileToDisk", err);
    });

    return p;
  }

  public async deleteImageFile(this: ImageFileAccess, path: string): Promise<void> {
    await fs.rm(path).catch((err) => {
      throw new FileSystemException(__filename, "deleteImageFile", err);
    });
  }

  constructor(private pathService: PathService) { }
}
