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

import { injectable } from "tsyringe";
import { TaskException } from "../exceptions/taskException";
import { GrabMbIDTask } from "./tasks/grabMbid";
import { UpdateAlbumMetadataTask } from "./tasks/updateAlbumMetadata";
import { UpdateArtistMetadataTask } from "./tasks/updateArtistMetadata";
import { UpdateSongMetadataTask } from "./tasks/updateSongMetadata";
import { Logger } from "../../../utils/logger";

@injectable()
export class MetadataGrabberWorker {
  public async doWork() {
    this.logger.info("Metadata grabber started", "Metadata Grabber");
    try {
      await this.grabMbid.doTask();
      await this.updateSongMetadata.doTask();
      await this.updateAlbumMetadata.doTask()
      await this.updateArtistMetadata.doTask()
    } catch (err) {
      this.logger.error(new TaskException(__filename, "doWork", err))
    }
  }

  constructor(
    private updateSongMetadata: UpdateSongMetadataTask,
    private updateAlbumMetadata: UpdateAlbumMetadataTask,
    private updateArtistMetadata: UpdateArtistMetadataTask,
    private grabMbid: GrabMbIDTask,
    private logger: Logger
  ) { }
}