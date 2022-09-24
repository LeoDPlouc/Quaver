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

import { MUSIC_PATH } from "../../config/config";
import { logger } from "../../utils/logger";
import { songService } from "../../service/songService";
import { fileService } from "../../service/fileService";
import { TaskException } from "./exceptions/taskException";

let songPaths: string[];

async function collect() {
  try {
    var paths = await fileService.getAllFiles(MUSIC_PATH);
  } catch (err) {
    throw new TaskException(__filename, "collect", err);
  }

  for (let i = 0; i < paths.length; i++) {
    try {
      if (!fileService.isMusicFile(paths[i])) continue; //Only consider audio files

      if (songPaths.find((p) => p == paths[i])) continue; //Pass if song already exists

      let songData = await fileService.getMetadataFromFile(paths[i]);
      let song: Song = { ...songData, path: paths[i] }
      song.mbids = await songService.getSongMbids(songData)

      await songService.createSong(song);
      logger.info(`Found new song ${song.path}`, "Song Collector");
    } catch (err) {
      logger.error(new TaskException(__filename, "collect", err));
    }
  }
}

async function updatePaths(): Promise<void> {
  songPaths = await songService.getAllSongPaths().catch((err) => {
    throw new TaskException(__filename, "updatePaths", err);
  });
}

export default async function doWork() {
  logger.info("Song collection Started", "Song Collector");

  //Collection run in background and is relaunched every 30 sec
  try {
    await updatePaths();
    await collect();
  } catch (err) {
    logger.error(new TaskException(__filename, "doWork", err));
  }
}
