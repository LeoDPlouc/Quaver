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

import { fileService } from "../../../../service/fileService";
import { songService } from "../../../../service/songService";
import { logger } from "../../../../utils/logger";
import { MetadataGrabberException } from "../../exceptions/metadataGrabberException";
import { TaskException } from "../../exceptions/taskException";

export async function grabMbid() {
    let songs = await songService.getMbidlessSong()
    .catch((err) => {throw new MetadataGrabberException(__filename, "grabMbid", err)});
  
    for (let i = 0; i < songs.length; i++) {
      try {
        let songData = await fileService.getMetadataFromFile(songs[i].path)
        let mbid = await songService.fetchSongMBId(songData);
        if (!mbid) continue; //Pass if no Mbid have been found
  
        songs[i].mbid = mbid;
        await songService.updateSong(songs[i]);
  
        logger.info(`Found Mbid for song ${songs[i].id}`, "Metadata Grabber");
      } catch (err) {
        logger.error(new MetadataGrabberException(__filename, "grabMbid", err));
        logger.debug(1, `SongData : ${JSON.stringify(songs[i])}`, "metadataGrabber")
      }
    }
  }