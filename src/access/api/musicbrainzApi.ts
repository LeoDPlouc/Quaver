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

  public async getSongMBId(this: MusicBrainzApiAccess, song: SongData): Promise<string> {
    //Build query with available info
    return await mbApi2.searchRecording({ recording: song.title, artist: song.artist, release: song.album, date: String(song.year) })
      .then(result => result.recordings.find(recording => recording.score == 100))
      .then(recording => recording ? recording.id : null)
      .catch((err) => {
        throw new MusicBrainzException(__filename, "getSongMBId", err);
      });
  }

  public async getSongMetadata(this: MusicBrainzApiAccess, mbid: string): Promise<{ song: Song, albumMbid: string, artistsMbid: string[] }> {
    let song: Song = { path: "dummy-path" };

    try {
      let recording = await mbApi2.lookupRecording({ mbid: mbid, inc: ["artists", "releases", "media"] })
      let release = recording.releases?.find(r => r.date == recording["first-release-date"])
      let artists = recording["artist-credit"]

      song.artist = recording?.["artist-credit"]?.[0]?.name
      song.title = recording.title;
      song.year = new Date(recording["first-release-date"]).getFullYear();
      song.n = release.media[0].position

      var albumMbid = release.id
      var artistsMbid = artists.map(a => a.artist.id)
    } catch (err) {
      logger.error(new MusicBrainzException(__filename, "getSongMetadata", err));
    }

    return { song, albumMbid, artistsMbid }
  }

  public async getAlbumMetadata(this: MusicBrainzApiAccess, mbid: string): Promise<{ album: Album, artistsMbid: string[] }> {
    let album: Album = {};

    try {
      let release = await mbApi2.lookupRelease({ mbid: mbid, inc: ["artists", "artist-credits"] })
      let artists = release["artist-credit"]

      album.artist = release["artist-credit"]?.[0]?.name;
      album.title = release.title;
      album.year = new Date(release.date).getFullYear();

      var artistsMbid = artists.map(a => a.artist.id)
    } catch (err) {
      logger.error(new MusicBrainzException(__filename, "getAlbumMetadata", err));
    }

    return { album, artistsMbid };
  }
}

export const musicBrainzApiAccess = new MusicBrainzApiAccess();
