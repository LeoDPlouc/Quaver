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

import { Album, Artist, Song } from "./models"

export async function getAllSongs(): Promise<Song[]> {
    var res = await fetch("/api/song")
    var body = await res.json()
    var songs = body.data.songs as Song[]

    songs.sort((song1, song2) => {
        if (song1.artist > song2.artist)
            return 1
        else if (song1.artist == song2.artist) {
            if (song1.album > song2.album)
                return 1
            else if (song1.album == song2.album) {
                if (song1.n > song2.n)
                    return 1
                else
                    return -1
            }
            else
                return -1
        }
        else
            return -1
    })
    return songs
}

export async function getAlbumSongs(id: string): Promise<Song[]> {
    var res = await fetch("/api/album/" + id + "/songs")
    var body = await res.json()
    var songs = body.data.songs as Song[]

    songs.sort((song1, song2) => {
        if (song1.n > song2.n)
            return 1
        else return -1
    })
    return songs
}

export async function getArtistSongs(id: string): Promise<Song[]> {
    var res = await fetch("/api/artist/" + id + "/songs")
    var body = await res.json()
    var songs = body.data.songs as Song[]

    songs.sort((song1, song2) => {
        if (song1.n > song2.n)
            return 1
        else return -1
    })
    return songs
}

export async function getAllArtists(): Promise<Artist[]> {
    var res = await fetch("/api/artist")
    var body = await res.json()
    var artists = body.data.artists as Artist[]

    artists.sort((artist1, artist2) => {
        if (artist1.name > artist2.name)
            return 1
        else return -1
    })
    return artists
}

export async function getArtist(id: string): Promise<Artist> {
    var res = await fetch("/api/artist/" + id)
    var body = await res.json()
    return body.data.artist as Artist
}

export async function getAllAlbums(): Promise<Album[]> {
    var res = await fetch("/api/album")
    var body = await res.json()
    var albums = body.data.albums as Album[]

    albums.sort((album1, album2) => {
        if (album1.title > album2.title)
            return 1
        else return -1
    })
    return albums
}

export async function getAlbum(id: string): Promise<Album> {
    var res = await fetch("/api/album/" + id)
    var body = await res.json()
    return body.data.album as Album
}

export async function getArtistAlbums(id: string): Promise<Album[]> {
    var res = await fetch("/api/artist/" + id + "/albums")
    var body = await res.json()
    var albums = body.data.albums as Album[]

    albums.sort((album1, album2) => {
        if (album1.title > album2.title)
            return 1
        else return -1
    })
    return albums
}