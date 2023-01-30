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

import { MUSIC_PATH } from "../../../../config/config";
import { Song } from "../../../../models/song";
import { fileService } from "../../../../service/fileService";
import { songService } from "../../../../service/songService";
import { logger } from "../../../../utils/logger";
import { TaskException } from "../../exceptions/taskException";

export async function collect() {
  try {
    var songPaths = await songService.getPathsFromAllSong()
    var paths = await fileService.getAllFiles(MUSIC_PATH);
  } catch (err) {
    throw new TaskException(__filename, "collect", err);
  }

  for (let i = 0; i < paths.length; i++) {
    try {
      if (!fileService.isMusicFile(paths[i])) continue; //Only consider audio files

      if (songPaths.find((p) => p == paths[i])) continue; //Pass if song already exists

      let songData = await fileService.getMetadataFromFile(paths[i]);
      let song: Song = { path: paths[i], duration: songData.duration, year: songData.year, title: songData.title }

      await songService.createSong(song);
      logger.info(`Found new song ${song.path}`, "Song Collector");
    } catch (err) {
      logger.error(new TaskException(__filename, "collect", err));
    }
  }
}