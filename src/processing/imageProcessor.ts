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

import { v4 } from "uuid"
import fs from "fs/promises"
import path from "path"
import { IMAGES_PATH } from "../config/config"
import { IImage } from "../access/database/models/imageModel"

export async function saveImage(data: string, extension: string): Promise<string> {
    //Create an UUID for the name of the file
    var filename = v4() + extension
    var p = path.resolve(IMAGES_PATH, filename)

    await fs.writeFile(p, data, { encoding: "binary" })

    return p
}

export async function deleteImage(image: IImage): Promise<void> {
    return await fs.rm(image.path)
}