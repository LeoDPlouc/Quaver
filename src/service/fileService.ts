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

import fs from "fs/promises";
import path from "path";
import mm from "mime-types";
import { logger } from "../utils/logger";
import { DATA_PATH } from "../config/config";
import { FileSystemException } from "../utils/exceptions/fileSystemException";
import { ServiceException } from "./exceptions/serviceException";
import { MimeLookupException } from "./exceptions/MimeLookupException";

class FileService {
  public async getAllFiles(this: FileService, folder: string): Promise<string[]> {
    let allPaths: string[] = [];

    var paths = await fs.readdir(folder, { withFileTypes: true }).catch((err) => {
      throw new FileSystemException(__filename, "getAllFiles", err);
    });

    for (var i = 0; i < paths.length; i++) {
      var fullPath = path.join(folder, paths[i].name);

      if (paths[i].isDirectory()) {
        try {
          (await this.getAllFiles(fullPath)).forEach((p) => allPaths.push(p));
        } catch (err) {
          logger.debugError(1, new ServiceException(__filename, "getAllFiles", err));
          continue;
        }
      }

      if (paths[i].isFile()) {
        allPaths.push(path.resolve(fullPath));
      }
    }

    return allPaths;
  }

  public async isMusicFile(this: FileService, file: string) {
    try {
      return !mm.lookup(path.extname(file)).match("audio")
    } catch (err) {
      throw new MimeLookupException(__filename, "isMusicFile", err)
    }
  }

  public getImagesPath(this: FileService) {
    try {
      let imageDir = path.join(DATA_PATH, "images")
      if (!fs.access(imageDir).then(_ => true).catch(_ => false)) {
        fs.mkdir(imageDir)
      }
      return imageDir
    } catch (err) {
      throw new FileSystemException(__filename, "getImagesPath", err)
    }
  }

  public getLogsPath(this: FileService) {
    try {
      let logsDir = path.join(DATA_PATH, "logs")
      if (!fs.access(logsDir).then(_ => true).catch(_ => false)) {
        fs.mkdir(logsDir)
      }
      return logsDir
    } catch (err) {
      throw new FileSystemException(__filename, "getImagesPath", err)
    }
  }
}

export const fileService = new FileService();
