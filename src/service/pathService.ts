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
import path from "path";
import { DATA_PATH } from "../config/config";
import { FileSystemException } from "../utils/exceptions/fileSystemException";

@injectable()
export class PathService {
    public getImagesPath() {
        try {
            return path.join(DATA_PATH, "images")
        } catch (err) {
            throw new FileSystemException(__filename, "getImagesPath", err)
        }
    }

    public getLogsPath() {
        try {
            return path.join(DATA_PATH, "logs")
        } catch (err) {
            throw new FileSystemException(__filename, "getImagesPath", err)
        }
    }
}