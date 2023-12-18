// Quaver is a self-hostable music player and music library manager
// Copyright (C) 2023  DPlouc
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
import { cleanDatabase, cleanTestEnvironnement } from "../../../util"
import { ArtistModel } from "../../../../src/access/database/models/artistModel"
import { ArtistDAO } from "../../../../src/access/database/artistDAO"
import { ArtistModelMock } from "../../../mock/access/models/artistModel.mock"
import { ArtistMapper } from "../../../../src/mappers/artistMapper"
import { SongModel } from "../../../../src/access/database/models/songModel"
import { DAOException } from "../../../../src/access/database/exceptions/DAOException"
import { AlbumModel } from "../../../../src/access/database/models/albumModel"
import { SongModelMock } from "../../../mock/access/models/songModel.mock"
import { AlbumModelMock } from "../../../mock/access/models/albumModel.mock"
import { getCleanSongDb } from "../../../testData/songTestData"
import { getCleanAlbum, getCleanAlbumDb } from "../../../testData/albumTestData"
import { getArtistDbNeverUpdated, getArtistDbToUpdate, getCleanArtist, getCleanArtistDb } from "../../../testData/artistTestData"

describe("ArtistDAO tests", () => {
    describe("getAllArtistModel test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should get all models", async () => {
            const artistModel = container.resolve(ArtistModel)
            const artistDAO = container.resolve(ArtistDAO)

            await artistModel.create(getCleanArtistDb())

            let results = await artistDAO.getAllArtistModel()

            expect(results).toHaveLength(1)
        })

        it("Should throw error on model error", async () => {
            const artistModelMock = new ArtistModelMock()
            artistModelMock.find = jest.fn(() => { throw new Error("Test error") })

            const albumModel = new AlbumModel()
            const songModel = new SongModel()
            const artistMapper = container.resolve(ArtistMapper)
            const artistDAO = new ArtistDAO(albumModel, artistModelMock, songModel, artistMapper)

            await artistDAO.getAllArtistModel().catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("getArtistModel test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should get model by id", async () => {
            const artistModel = container.resolve(ArtistModel)
            const artistDAO = container.resolve(ArtistDAO)

            let id = (await artistModel.create(getCleanArtistDb()))._id

            let result = await artistDAO.getArtistModel(id.toString())

            expect(result.name).toBe(getCleanArtistDb().name)
        })

        it("Should throw error on model error", async () => {
            const artistModelMock = new ArtistModelMock()
            artistModelMock.findById = jest.fn(() => { throw new Error("Test error") })

            const albumModel = new AlbumModel()
            const songModel = new SongModel()
            const artistMapper = container.resolve(ArtistMapper)
            const artistDAO = new ArtistDAO(albumModel, artistModelMock, songModel, artistMapper)

            artistDAO.getArtistModel("").catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("getSongModelFromArtist test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should get song model from artist", async () => {
            const artistModel = container.resolve(ArtistModel)
            const songModel = container.resolve(SongModel)
            const artistDAO = container.resolve(ArtistDAO)

            let id = (await artistModel.create(getCleanArtistDb()))._id

            await songModel.create({ ...getCleanSongDb(), artists: [id] })

            let results = await artistDAO.getSongModelFromArtist(id.toString())

            expect(results).toHaveLength(1)
        })

        it("Should not get song model not from artist", async () => {
            const artistModel = container.resolve(ArtistModel)
            const songModel = container.resolve(SongModel)
            const artistDAO = container.resolve(ArtistDAO)

            let id = (await artistModel.create(getCleanArtistDb()))._id

            await songModel.create(getCleanSongDb())

            let results = await artistDAO.getSongModelFromArtist(id.toString())

            expect(results).toHaveLength(0)
        })

        it("Should throw error on model error", async () => {
            const songModelMock = new SongModelMock()
            songModelMock.find = jest.fn(() => { throw new Error("Test error") })

            const artistModel = new ArtistModel()
            const albumModel = new AlbumModel()
            const artistMapper = container.resolve(ArtistMapper)
            const artistDAO = new ArtistDAO(albumModel, artistModel, songModelMock, artistMapper)

            artistDAO.getSongModelFromArtist("").catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("getAlbumModelFromArtist test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should get album model from artist", async () => {
            const artistModel = container.resolve(ArtistModel)
            const albumModel = container.resolve(AlbumModel)
            const artistDAO = container.resolve(ArtistDAO)

            let id = (await artistModel.create(getCleanArtistDb()))._id

            
            await albumModel.create({ ...getCleanAlbumDb(), artists: [id] })

            let results = await artistDAO.getAlbumModelFromArtist(id.toString())

            expect(results).toHaveLength(1)
        })

        it("Should not get album model not from artist", async () => {
            const artistModel = container.resolve(ArtistModel)
            const albumModel = container.resolve(AlbumModel)
            const artistDAO = container.resolve(ArtistDAO)

            let id = (await artistModel.create(getCleanArtistDb()))._id

            await albumModel.create(getCleanAlbumDb())

            let results = await artistDAO.getAlbumModelFromArtist(id.toString())

            expect(results).toHaveLength(0)
        })

        it("Should throw error on model error", async () => {
            const albumModelMock = new AlbumModelMock()
            albumModelMock.find = jest.fn(() => { throw new Error("Test error") })

            const artistModel = new ArtistModel()
            const songModel = new SongModel()
            const artistMapper = container.resolve(ArtistMapper)
            const artistDAO = new ArtistDAO(albumModelMock, artistModel, songModel, artistMapper)

            artistDAO.getAlbumModelFromArtist("").catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("createArtistModel test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should create an album", async () => {
            const artistModel = container.resolve(ArtistModel)
            const artistDAO = container.resolve(ArtistDAO)

            let id = await artistDAO.createArtistModel(getCleanArtist())

            let result = await artistModel.findById(id)

            expect(result).toBeDefined()
            expect(result?.name).toBe(getCleanArtist().name)
        })

        it("Should throw error on model error", async () => {
            const artistModelMock = new ArtistModelMock()
            artistModelMock.create = jest.fn(() => { throw new Error("Test error") })

            const albumModel = new AlbumModel()
            const songModel = new SongModel()
            const artistMapper = container.resolve(ArtistMapper)
            const artistDAO = new ArtistDAO(albumModel, artistModelMock, songModel, artistMapper)

            await artistDAO.createArtistModel({}).catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("findAlbumModelByName test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should find model by name", async () => {
            const artistModel = container.resolve(ArtistModel)
            const artistDAO = container.resolve(ArtistDAO)

            await artistModel.create(getCleanArtistDb())

            let result = await artistDAO.findArtistModelByName(getCleanArtist().name ?? "")

            expect(result).toHaveLength(1)
        })

        it("Should not find model with wrong name", async () => {
            const artistModel = container.resolve(ArtistModel)
            const artistDAO = container.resolve(ArtistDAO)

            await artistModel.create(getCleanArtistDb())

            let result = await artistDAO.findArtistModelByName("Other name")

            expect(result).toHaveLength(0)
        })

        it("Should throw error on model error", async () => {
            const artistModelMock = new ArtistModelMock()
            artistModelMock.find = jest.fn(() => { throw new Error("Test error") })

            const albumModel = new AlbumModel()
            const songModel = new SongModel()
            const artistMapper = container.resolve(ArtistMapper)
            const artistDAO = new ArtistDAO(albumModel, artistModelMock, songModel, artistMapper)

            await artistDAO.findArtistModelByName("").catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("updateArtistModel test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should update model", async () => {
            const artistModel = container.resolve(ArtistModel)
            const artistDAO = container.resolve(ArtistDAO)

            let id = await artistModel.create(getCleanArtistDb())
                .then(artist => artist.id)

            const name = "new test name"
            await artistDAO.updateArtistModel({ id, name })

            let result = await artistModel.findById(id)

            expect(result?.name).toBe(name)
        })

        it("Should throw error on model error", async () => {
            const artistModelMock = new ArtistModelMock()
            artistModelMock.findByIdAndUpdate = jest.fn(() => { throw new Error("Test error") })

            const albumModel = new AlbumModel()
            const songModel = new SongModel()
            const artistMapper = container.resolve(ArtistMapper)
            const artistDAO = new ArtistDAO(albumModel, artistModelMock, songModel, artistMapper)

            await artistDAO.updateArtistModel({}).catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("findArtistsByMbids test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should find model by mbid", async () => {
            const artistModel = container.resolve(ArtistModel)
            const artistDAO = container.resolve(ArtistDAO)

            await artistModel.create(getCleanArtistDb())

            let result = await artistDAO.findArtistsByMbids([getCleanAlbum().mbid ?? ""])

            expect(result).toHaveLength(1)
        })

        it("Should throw error on model error", async () => {
            const artistModelMock = new ArtistModelMock()
            artistModelMock.find = jest.fn(() => { throw new Error("Test error") })

            const albumModel = new AlbumModel()
            const songModel = new SongModel()
            const artistMapper = container.resolve(ArtistMapper)
            const artistDAO = new ArtistDAO(albumModel, artistModelMock, songModel, artistMapper)

            await artistDAO.findArtistsByMbids([]).catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("getArtistModelForMetadataGrabber test", () => {
        beforeEach(cleanDatabase)

        it("Should get model updated too long ago", async () => {
            const artistModel = container.resolve(ArtistModel)
            const artistDAO = container.resolve(ArtistDAO)

            await artistModel.create(getArtistDbToUpdate())

            let results = await artistDAO.getArtistModelForMetadataGrabber()

            expect(results).toHaveLength(1)
        })

        it("Should get model never updated", async () => {
            const artistModel = container.resolve(ArtistModel)
            const artistDAO = container.resolve(ArtistDAO)

            await artistModel.create(getArtistDbNeverUpdated())

            let results = await artistDAO.getArtistModelForMetadataGrabber()

            expect(results).toHaveLength(1)
        })

        it("Should not get model recently updated", async () => {
            const artistModel = container.resolve(ArtistModel)
            const artistDAO = container.resolve(ArtistDAO)

            await artistModel.create(getCleanArtistDb())

            let results = await artistDAO.getArtistModelForMetadataGrabber()

            expect(results).toHaveLength(0)
        })

        it("Should throw error on model error", async () => {
            const artistModelMock = new ArtistModelMock()
            artistModelMock.find = jest.fn(() => { throw new Error("Test error") })

            const albumModel = new AlbumModel()
            const songModel = new SongModel()
            const artistMapper = container.resolve(ArtistMapper)
            const artistDAO = new ArtistDAO(albumModel, artistModelMock, songModel, artistMapper)

            await artistDAO.getArtistModelForMetadataGrabber().catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })
})