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

import { Album, Artist, Song } from "./models";

export function searchSong(query: string, song: Song[]): Song[] {

    if (!query.length) query = ".*"

    console.log(query)

    console.log(song)

    return song.filter(s => {
        if (!s.title) return false
        var match = s.title.toLowerCase().match(query.toLowerCase())
        return match != null && match.length > 0
    })

}

export function searchAlbum(query: string, album: Album[]): Album[] {

    if (!query.length) query = ".*"

    console.log(query)

    console.log(album)

    return album.filter(s => {
        if (!s.title) return false
        var match = s.title.toLowerCase().match(query.toLowerCase())
        return match != null && match.length > 0
    })

}

export function searchArtist(query: string, artist: Artist[]): Artist[] {

    if (!query.length) query = ".*"

    console.log(query)

    console.log(artist)

    return artist.filter(a => {
        if (!a.name) return false
        var match = a.name.toLowerCase().match(query.toLowerCase())
        return match != null && match.length > 0
    })

}