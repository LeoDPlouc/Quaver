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
import { createFailure } from "../utils/Failure";
import { logError } from "../utils/logger";

class FileService {
  public async getAllFiles(this: FileService, folder: string): Promise<string[]> {
    let allPaths: string[] = [];

    var paths = await fs.readdir(folder, { withFileTypes: true }).catch((err) => {
      throw createFailure(err, __filename, "getAllFiles");
    });

    for (var i = 0; i < paths.length; i++) {
      var fullPath = path.join(folder, paths[i].name);

      if (paths[i].isDirectory()) {
        try {
          (await this.getAllFiles(fullPath)).forEach((p) => allPaths.push(p));
        } catch (err) {
          logError("File access eror", __filename, "getAllFiles", err);
          continue;
        }
      }

      if (paths[i].isFile()) {
        allPaths.push(path.resolve(fullPath));
      }
    }

    return allPaths;
  }
}

export const fileService = new FileService();
