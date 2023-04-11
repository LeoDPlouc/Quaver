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
import { FileSystemException } from "../utils/exceptions/fileSystemException";
import { ServiceException } from "./exceptions/serviceException";
import { MimeLookupException } from "./exceptions/MimeLookupException";
import { injectable, delay, inject } from "tsyringe";
import { SongFileAccess } from "../access/file/songFile";
import { Logger } from "../utils/logger";
import { PathService } from "./pathService";

@injectable()
export class FileService {
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
          this.logger.debugError(1, new ServiceException(__filename, "getAllFiles", err));
          continue;
        }
      }

      if (paths[i].isFile()) {
        allPaths.push(path.resolve(fullPath));
      }
    }

    return allPaths;
  }

  public isMusicFile(this: FileService, file: string): boolean {
    try {
      return !!mm.lookup(path.extname(file)).match("audio")
    } catch (err) {
      throw new MimeLookupException(__filename, "isMusicFile", err)
    }
  }

  public async getMetadataFromFile(this: FileService, songPath: string): Promise<SongData> {
    return await this.songFileAccess
      .getMetadataFromFile(songPath).catch((err) => {
        throw new ServiceException(__filename, "getMetadataFromFile", err);
      });
  }

  public async checkDataDirectores(this: FileService): Promise<void> {
    try {
      let logsDir = this.pathService.getLogsPath()
      if (!(await fs.access(logsDir).then(_ => true).catch(_ => false))) {
        await fs.mkdir(logsDir, { recursive: true })
        this.logger.info("Created Log directory", "File Service")
      }

      let imageDir = this.pathService.getImagesPath()
      if (!(await fs.access(imageDir).then(_ => true).catch(_ => false))) {
        await fs.mkdir(imageDir, { recursive: true })
        this.logger.info("Created Images directory", "File Service")
      }
    } catch (err) {
      throw new ServiceException(__filename, "checkDataDirectores", err)
    }
  }

  constructor(
    private songFileAccess: SongFileAccess,
    private logger: Logger,
    private pathService: PathService
  ) { }
}
