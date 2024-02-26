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
import { connectToDb } from "../src/DAO/utils"
import mongoose from "mongoose"
import { AlbumModel } from "../src/DAO/models/albumModel"
import { SongModel } from "../src/DAO/models/songModel"
import { ArtistModel } from "../src/DAO/models/artistModel"
import { ImageModel } from "../src/DAO/models/imageModel"
import { LoggerMock } from "./mock/utils/logger.mock"
import { LoggerToken } from "../src/utils/interfaces/logger.inter"

const artistModel = container.resolve<ArtistModel>(ArtistModel)
const albumModel = container.resolve<AlbumModel>(AlbumModel)
const songModel = container.resolve<SongModel>(SongModel)
const imageModel = container.resolve<ImageModel>(ImageModel)

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

export function injectMockLogger() {
    container.register(LoggerToken, LoggerMock);
}