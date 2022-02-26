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

import { waitForDb } from "../src/db/initdb"
import { Artist } from "../src/models/artistModel"
import { Album } from "../src/models/albumModel"
import { Song } from "../src/models/songModel"
import { Image } from "../src/models/imageModel"
import mongoose from "mongoose"

export async function createDatabase() {
    await waitForDb()

    var artist = await new Artist({ name: "Nirvana" }).save()
    var album = await new Album({ artist: "Nirvana", artistId: artist.id, title: "Nevermind", year: 1991 }).save()
    await new Song({ album: "Nevermind", albumId: album.id, artist: "Nirvana", artistId: artist.id, n: 1, like: 0, path: "/dev/zero", title: "Smells Like Teen Spirit", year: 1991 }).save()
    await new Song({ album: "Nevermind", albumId: album.id, artist: "Nirvana", artistId: artist.id, n: 3, like: 0, path: "/dev/zero", title: "Come as You Are", year: 1991 }).save()
    await new Song({ album: "Nevermind", albumId: album.id, artist: "Nirvana", artistId: artist.id, n: 2, like: 0, path: "/dev/zero", title: "In Bloom", year: 1991 }).save()
    await new Song({ album: "Nevermind", albumId: album.id, artist: "Nirvana", artistId: artist.id, n: 4, like: 0, path: "/dev/zero", title: "Breed", year: 1991 }).save()
    await new Song({ album: "Nevermind", albumId: album.id, artist: "Nirvana", artistId: artist.id, n: 5, like: 0, path: "/dev/zero", title: "Lithium", year: 1991 }).save()
    await new Image({ path: "/dev/zero" }).save()
}

export async function cleanDatabase() {
    await Artist.deleteMany()
    await Album.deleteMany()
    await Song.deleteMany()
    await Image.deleteMany()

    await mongoose.disconnect()
}

export async function getOneSong() {
    var songs = await Song.find()
    return songs[0]
}

export async function getOneAlbum() {
    var albums = await Album.find()
    return albums[0]
}

export async function getOneArtist() {
    var artists = await Artist.find()
    return artists[0]
}

export async function getOneImage() {
    var images = await Image.find()
    return images[0]
}