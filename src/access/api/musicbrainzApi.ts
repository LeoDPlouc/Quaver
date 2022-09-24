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

import { ILinkedEntitiesRecording, IRecording, IReleaseList, ISearchResult, MusicBrainzApi } from "musicbrainz-api";
import { APP_VERSION } from "../../config/appConfig";
import { logger } from "../../utils/logger";
import { MusicBrainzException } from "./exceptions/MusicBrainzException"; // DEPRECATED 
import { MusicBrainzApi as mba } from "musicbrainz-ts";

//DEPRECATED Ne plus exporter lors du nettoyage des dépréciés, mettre dans la class
export const mbApi = new MusicBrainzApi({
  appName: "Quaver",
  appVersion: APP_VERSION,
  appContactInfo: "https://github.com/LeoDPlouc/Quaver",
});

const mbApi2 = new mba("Quaver", APP_VERSION, "https://github.com/LeoDPlouc/Quaver")

class MusicBrainzApiAccess {
  public async getMBId(this: MusicBrainzApiAccess, album: Album): Promise<string[]> { // DEPRECIATED
    //Build query with available info
    let query = `release:${album.title as string}`;

    if (album.artist) {
      query += ` AND artist:${album.artist}`;
    }

    return await mbApi
      .search<IReleaseList>("release", { query })
      .then((result) => result.releases.filter((release) => release.score == 100))
      .then((releases) => releases.map((release) => release.id))
      .catch((err) => {
        throw new MusicBrainzException(__filename, "getMBId", err);
      });
  }

  public async getSongMBId(this: MusicBrainzApiAccess, song: SongData): Promise<string[]> {
    //Build query with available info
    return await mbApi2.searchRecording({ recording: song.title, artist: song.artist, release: song.album, date: String(song.year) })
      .then(result => result.recordings.filter(recording => recording.score == 100))
      .then(recordings => recordings.map(recording => recording.id))
      .catch((err) => {
        throw new MusicBrainzException(__filename, "getMBId", err);
      });
  }

  public async getMetadataFromMB(this: MusicBrainzApiAccess, mbids: string[]): Promise<Album> {
    let album: Album = {};

    for (let i = 0; i < mbids.length; i++) {
      try {
        let release = await mbApi.getRelease(mbids[i]);

        if (!album.artist) album.artist = release["artist-credit"]?.[0]?.name;
        if (!album.title) album.title = release.title;
        if (!album.year) album.year = new Date(release.date).getFullYear();
      } catch (err) {
        logger.error(new MusicBrainzException(__filename, "getMetadataFromMB", err));
      }
    }

    return album;
  }
}

export const musicBrainzApiAccess = new MusicBrainzApiAccess();
