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
import { SongMetadata } from "./DTO/songMetadata";
import { AlbumMetadata } from "./DTO/albumMetadata";
import { Album } from "../../models/album";

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

  public async fetchSongMBId(this: MusicBrainzApiAccess, song: SongData): Promise<string> {
    //Build query with available info
    return await mbApi2.searchRecording({ recording: song.title, artist: song.artist, release: song.album, date: String(song.year) })
      .then(result => result.recordings.find(recording => recording.score == 100))
      .then(recording => recording ? recording.id : null)
      .catch((err) => {
        throw new MusicBrainzException(__filename, "fetchSongMBId", err);
      });
  }

  public async fetchSongMetadata(this: MusicBrainzApiAccess, mbid: string): Promise<SongMetadata> {
    try {
      let song: SongMetadata = {}

      let recording = await mbApi2.lookupRecording({ mbid: mbid, inc: ["artists", "releases", "media"] })
      let release = recording.releases?.find(r => r.date == recording["first-release-date"])
      let artists = recording["artist-credit"]

      song.artists = artists?.map((artist) => ({ mbid: artist.artist.id }))
      song.album = { mbid: release.id }
      song.title = recording.title;
      song.year = new Date(recording["first-release-date"]).getFullYear();
      song.n = release.media[0].position
      song.joinings = recording["artist-credit"].map((artist) => ({
        mbid: artist.artist.id,
        joinphrase: artist.joinphrase
      }));

      return song
    } catch (err) {
      throw new MusicBrainzException(__filename, "fetchSongMetadata", err);
    }
  }

  public async fetchAlbumMetadata(this: MusicBrainzApiAccess, mbid: string): Promise<AlbumMetadata> {
    try {
      let album: AlbumMetadata = {}

      let release = await mbApi2.lookupRelease({ mbid: mbid, inc: ["artists", "artist-credits"] })
      let artists = release["artist-credit"]

      album.artists = release["artist-credit"]?.map((artist) => ({ mbid: artist.artist.id }))
      album.title = release.title;
      album.year = new Date(release.date).getFullYear();
      album.joinings = release["artist-credit"].map((artist) => ({
        mbid: artist.artist.id,
        joinphrase: artist.joinphrase
      }));

      return album
    } catch (err) {
      throw new MusicBrainzException(__filename, "fetchAlbumMetadata", err);
    }
  }

  public async fetchArtistMetadata(this: MusicBrainzApiAccess, mbid: string): Promise<ArtistMetadata> {
    try {
      let artist: ArtistMetadata = {}

      let artistMetadata = await mbApi2.lookupArtist({ mbid })

      artist.name = artistMetadata.name

      return artist
    } catch (err) {
      throw new MusicBrainzException(__filename, "fetchArtistMetadata", err);
    }
  }
}

export const musicBrainzApiAccess = new MusicBrainzApiAccess();
