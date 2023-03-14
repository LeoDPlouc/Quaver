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

import { MusicBrainzException } from "./exceptions/MusicBrainzException"; // DEPRECATED 
import { SongMetadata } from "./DTO/songMetadata";
import { AlbumMetadata } from "./DTO/albumMetadata";
import { injectable } from "tsyringe";
import { MusicBrainzAPI } from "./apiObjects/musicBrainzAPI";

@injectable()
export class MusicBrainzApiAccess {
  public async fetchSongMBId(this: MusicBrainzApiAccess, song: SongData): Promise<string> {
    //Build query with available info
    return await this.musicBrainzAPI.api.searchRecording({ recording: song.title, artist: song.artist, release: song.album, date: String(song.year) })
      .then(result => result.recordings.find(recording => recording.score == 100))
      .then(recording => recording ? recording.id : null)
      .catch((err) => {
        throw new MusicBrainzException(__filename, "fetchSongMBId", err);
      });
  }

  public async fetchSongMetadata(this: MusicBrainzApiAccess, mbid: string): Promise<SongMetadata> {
    try {
      let song: SongMetadata = {}

      let recording = await this.musicBrainzAPI.api.lookupRecording({ mbid: mbid, inc: ["artists", "releases", "media"] })
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

      let release = await this.musicBrainzAPI.api.lookupRelease({ mbid: mbid, inc: ["artists", "artist-credits"] })

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

      let artistMetadata = await this.musicBrainzAPI.api.lookupArtist({ mbid })

      artist.name = artistMetadata.name

      return artist
    } catch (err) {
      throw new MusicBrainzException(__filename, "fetchArtistMetadata", err);
    }
  }

  constructor(private musicBrainzAPI: MusicBrainzAPI) { }
}
