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

import { AlbumMetadata } from "../../../access/api/DTO/albumMetadata";
import { albumService } from "../../../service/albumService";
import { artistService } from "../../../service/artistService";
import { fileService } from "../../../service/fileService";
import { songService } from "../../../service/songService";
import { logger } from "../../../utils/logger";
import { TaskException } from "../exceptions/taskException";
import { grabMbid } from "./tasks/grabMbid";
import { updateAlbumMetadata } from "./tasks/updateAlbumMetadata";
import { updateArtistMetadata } from "./tasks/updateArtistMetadata";
import { updateSongMetadata } from "./tasks/updateSongMetadata";

export default async function doWork() {
  logger.info("Metadata grabber started", "Metadata Grabber");
  try {
    await grabMbid();
    await updateSongMetadata();
    await updateAlbumMetadata()
    await updateArtistMetadata()
  } catch (err) {
    logger.error(new TaskException(__filename, "doWork", err))
  }
}
