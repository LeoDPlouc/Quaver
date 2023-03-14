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

import { TaskException } from "../exceptions/taskException";
import { injectable } from "tsyringe"
import { CleanImagesWithoutAlbumTask } from "./tasks/cleanImagesWithoutAlbum";
import { CleanAlbumCoverIdTask } from "./tasks/cleanAlbumCoverId";
import { CleanImageWithoutTinyFileTask } from "./tasks/cleanImageWithoutTinyFile";
import { CleanImagesWithDeadFilesTask } from "./tasks/cleanImagesWithDeadFiles";
import { CleanFilesWithoutImageTask } from "./tasks/cleanFilesWithoutImage";
import { Logger } from "../../../utils/logger";
import { CleanImagesWithoutTinyFieldTask } from "./tasks/cleanImagesWithoutTinyField";

@injectable()
export class CoverCleanerWorker {
  public async doWork() {
    this.logger.info("Cover cleaner started", "Cover Cleaner");

    try {
      await this.cleanImagesWithoutAlbumTask.doTask();
      await this.cleanImagesWithoutTinyFileTask.doTask();
      await this.cleanImagesWithDeadFilesTask.doTask();
      await this.cleanImagesWithoutTinyFieldTask.doTask();
      await this.cleanFilesWithoutImageTask.doTask();
      await this.cleanAlbumCoverIdTask.doTask()
    } catch (err) {
      this.logger.error(new TaskException(__filename, "doWork", err));
    }
  }

  constructor(
    private cleanImagesWithoutAlbumTask: CleanImagesWithoutAlbumTask,
    private cleanAlbumCoverIdTask: CleanAlbumCoverIdTask,
    private cleanImagesWithoutTinyFieldTask: CleanImagesWithoutTinyFieldTask,
    private cleanImagesWithoutTinyFileTask: CleanImageWithoutTinyFileTask,
    private cleanImagesWithDeadFilesTask: CleanImagesWithDeadFilesTask,
    private cleanFilesWithoutImageTask: CleanFilesWithoutImageTask,
    private logger: Logger
  ) { }
}
