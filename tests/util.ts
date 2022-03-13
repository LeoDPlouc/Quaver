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

import { connectToDb } from "../src/access/database/utils"
import mongoose from "mongoose"
import { artistModel } from "../src/access/database/models/artistModel"
import { albumModel } from "../src/access/database/models/albumModel"
import { songModel } from "../src/access/database/models/songModel"
import { imageModel } from "../src/access/database/models/imageModel"

export async function createDatabase() {
    await connectToDb()

    var artist = await new artistModel({ name: "Nirvana" }).save()
    var album = await new albumModel({ artist: "Nirvana", artistId: artist.id, title: "Nevermind", year: 1991 }).save()
    await new songModel({ album: "Nevermind", albumId: album.id, artist: "Nirvana", artistId: artist.id, n: 1, like: 0, path: "/dev/zero", title: "Smells Like Teen Spirit", year: 1991 }).save()
    await new songModel({ album: "Nevermind", albumId: album.id, artist: "Nirvana", artistId: artist.id, n: 3, like: 0, path: "/dev/zero", title: "Come as You Are", year: 1991 }).save()
    await new songModel({ album: "Nevermind", albumId: album.id, artist: "Nirvana", artistId: artist.id, n: 2, like: 0, path: "/dev/zero", title: "In Bloom", year: 1991 }).save()
    await new songModel({ album: "Nevermind", albumId: album.id, artist: "Nirvana", artistId: artist.id, n: 4, like: 0, path: "/dev/zero", title: "Breed", year: 1991 }).save()
    await new songModel({ album: "Nevermind", albumId: album.id, artist: "Nirvana", artistId: artist.id, n: 5, like: 0, path: "/dev/zero", title: "Lithium", year: 1991 }).save()
    await new imageModel({ path: "/dev/zero" }).save()
}

export async function cleanDatabase() {
    await artistModel.deleteMany()
    await albumModel.deleteMany()
    await songModel.deleteMany()
    await imageModel.deleteMany()

    await mongoose.disconnect()
}

export async function getOneSong() {
    var songs = await songModel.find()
    return songs[0]
}

export async function getOneAlbum() {
    var albums = await albumModel.find()
    return albums[0]
}

export async function getOneArtist() {
    var artists = await artistModel.find()
    return artists[0]
}

export async function getOneImage() {
    var images = await imageModel.find()
    return images[0]
}