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

import { logger } from "../../../utils/logger";
import { TaskException } from "../exceptions/taskException";
import { cleanAlbumCoverId } from "./tasks/cleanAlbumCoverId";
import { cleanFilesWithoutImage } from "./tasks/cleanFilesWithoutImage";
import { cleanImagesWithDeadFiles } from "./tasks/cleanImagesWithDeadFiles";
import { cleanImagesWithoutAlbum } from "./tasks/cleanImagesWithoutAlbum";
import { cleanImagesWithoutTinyField } from "./tasks/cleanImagesWithoutTinyField";
import { cleanImageWithoutTinyFile } from "./tasks/cleanImageWithoutTinyFile";

export default async function doWork() {
  logger.info("Cover cleaner started", "Cover Cleaner");

  try {
    await cleanImagesWithoutAlbum();
    await cleanImageWithoutTinyFile();
    await cleanImagesWithDeadFiles();
    await cleanImagesWithoutTinyField();
    await cleanFilesWithoutImage();
    await cleanAlbumCoverId();
  } catch (err) {
    logger.error(new TaskException(__filename, "doWork", err));
  }
}
