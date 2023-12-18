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

import { container } from "tsyringe"
import { connectToDb } from "../src/access/database/utils"
import mongoose from "mongoose"
import { ArtistModel } from "../src/access/database/models/artistModel"
import { SongModel } from "../src/access/database/models/songModel"
import { ImageModel } from "../src/access/database/models/imageModel"
import { AlbumModel } from "../src/access/database/models/albumModel"

const artistModel = container.resolve(ArtistModel)
const albumModel = container.resolve(AlbumModel)
const songModel = container.resolve(SongModel)
const imageModel = container.resolve(ImageModel)

export async function cleanTestEnvironnement() {
    jest.clearAllMocks()
    jest.clearAllTimers()
    jest.resetAllMocks()
    jest.restoreAllMocks()
    jest.useRealTimers()
}

export async function cleanDatabase() {
    await mongoose.disconnect()
    await connectToDb("Test")

    await artistModel.model.deleteMany()
    await albumModel.deleteMany()
    await songModel.model.deleteMany()
    await imageModel.model.deleteMany()
}