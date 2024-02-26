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

import { cleanDatabase, cleanTestEnvironnement } from "../../../util"
import { container } from "tsyringe"
import { AlbumDAO } from "../../../../src/DAO/interfaces/albumDAO.inter"
import { SongModel } from "../../../../src/access/database/models/songModel"
import { AlbumMapper } from "../../../../src/mappers/albumMapper"
import { DAOException } from "../../../../src/access/database/exceptions/DAOException"
import { AlbumModel } from "../../../../src/access/database/models/albumModel"
import { AlbumModelMock } from "../../../mock/access/models/albumModel.mock"
import { ImageModel } from "../../../../src/access/database/models/imageModel"
import { getAlbumDbNeverCoverGrabbed, getAlbumDbNeverUpdated, getAlbumDbToCoverGrab, getAlbumDbToUpdate, getCleanAlbum, getCleanAlbumDb } from "../../../testData/albumTestData"
import { getCleanSongDb } from "../../../testData/songTestData"
import { getCleanImage } from "../../../testData/imageTestData"

describe("AlbumDAO tests", () => {
    describe("getAllAlbumsModel test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should get all models", async () => {
            const albumModel = container.resolve(AlbumModel)
            const albumDAO = container.resolve(AlbumDAO)

            await albumModel.create(getCleanAlbumDb())

            let results = await albumDAO.getAllAlbumModel()

            expect(results).toHaveLength(1)
        })

        it("Should throw error on model error", async () => {
            const albumModelMock = new AlbumModelMock()
            albumModelMock.find = jest.fn(() => { throw new Error("Test error") })

            const songModel = new SongModel()
            const albumMapper = container.resolve(AlbumMapper)
            const albumDAO = new AlbumDAO(albumModelMock, songModel, albumMapper)

            albumDAO.getAllAlbumModel().catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("getAlbumModel test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should get model by id", async () => {
            const albumModel = container.resolve(AlbumModel)
            const albumDAO = container.resolve(AlbumDAO)

            let id = (await albumModel.create(getCleanAlbumDb()))._id

            let result = await albumDAO.getAlbumModel(id.toString())

            expect(result.title).toBe(getCleanAlbum().title)
        })

        it("Should throw error on model error", async () => {
            const albumModelMock = new AlbumModelMock()
            albumModelMock.findById = jest.fn(() => { throw new Error("Test error") })

            const songModel = new SongModel()
            const albumMapper = container.resolve(AlbumMapper)
            const albumDAO = new AlbumDAO(albumModelMock, songModel, albumMapper)

            albumDAO.getAlbumModel("").catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("getSongModelFromAlbum test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should get song model from album", async () => {
            const albumModel = container.resolve(AlbumModel)
            const albumDAO = container.resolve(AlbumDAO)
            const songModel = container.resolve(SongModel)

            let id = (await albumModel.create(getCleanAlbumDb()))._id

            await songModel.create({ ...getCleanSongDb(), albumV2: id })

            let results = await albumDAO.getSongModelFromAlbum(id.toString())

            expect(results).toHaveLength(1)
        })

        it("Should not get song model not from album", async () => {
            const albumModel = container.resolve(AlbumModel)
            const albumDAO = container.resolve(AlbumDAO)
            const songModel = container.resolve(SongModel)

            let id = (await albumModel.create(getCleanAlbumDb()))._id

            await songModel.create({ ...getCleanSongDb() })

            let results = await albumDAO.getSongModelFromAlbum(id.toString())

            expect(results).toHaveLength(0)
        })

        it("Should throw error on model error", async () => {
            const albumModelMock = new AlbumModelMock()
            albumModelMock.find = jest.fn(() => { throw new Error("Test error") })

            const songModel = new SongModel()
            const albumMapper = container.resolve(AlbumMapper)
            const albumDAO = new AlbumDAO(albumModelMock, songModel, albumMapper)

            albumDAO.getSongModelFromAlbum("").catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("createAlbumModel test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should create an album", async () => {
            const albumModel = container.resolve(AlbumModel)
            const albumDAO = container.resolve(AlbumDAO)

            let id = await albumDAO.createAlbumModel(getCleanAlbum())

            let result = await albumModel.findById(id)

            expect(result).toBeDefined()
            expect(result?.title).toBe(getCleanAlbum().title)
        })

        it("Should throw error on model error", async () => {
            const albumModelMock = new AlbumModelMock()
            albumModelMock.create = jest.fn(() => { throw new Error("Test error") })

            const songModel = new SongModel()
            const albumMapper = container.resolve(AlbumMapper)
            const albumDAO = new AlbumDAO(albumModelMock, songModel, albumMapper)

            albumDAO.createAlbumModel({}).catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("findAlbumModelByName test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should find model by name", async () => {
            const albumModel = container.resolve(AlbumModel)
            const albumDAO = container.resolve(AlbumDAO)

            await albumModel.create(getCleanAlbumDb())

            let result = await albumDAO.findAlbumModelByName(getCleanAlbum().title ?? "")

            expect(result).toHaveLength(1)
        })

        it("Should not find model with wrong name", async () => {
            const albumModel = container.resolve(AlbumModel)
            const albumDAO = container.resolve(AlbumDAO)

            await albumModel.create(getCleanAlbumDb())

            let result = await albumDAO.findAlbumModelByName("other name")

            expect(result).toHaveLength(0)
        })


        it("Should throw error on model error", async () => {
            const albumModelMock = new AlbumModelMock()
            albumModelMock.find = jest.fn(() => { throw new Error("Test error") })

            const songModel = new SongModel()
            const albumMapper = container.resolve(AlbumMapper)
            const albumDAO = new AlbumDAO(albumModelMock, songModel, albumMapper)

            albumDAO.findAlbumModelByName("").catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("updateAlbumModel test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should update model", async () => {
            const albumModel = container.resolve(AlbumModel)
            const albumDAO = container.resolve(AlbumDAO)

            let id = await albumModel.create(getCleanAlbumDb())
                .then(album => album.id)

            const title = "new test title"
            await albumDAO.updateAlbumModel({ id, title })

            let result = await albumModel.findById(id)

            expect(result?.title).toBe(title)
        })

        it("Should throw error on model error", async () => {
            const albumModelMock = new AlbumModelMock()
            albumModelMock.findByIdAndUpdate = jest.fn(() => { throw new Error("Test error") })

            const songModel = new SongModel()
            const albumMapper = container.resolve(AlbumMapper)
            const albumDAO = new AlbumDAO(albumModelMock, songModel, albumMapper)

            albumDAO.updateAlbumModel({}).catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("getAlbumModelToCoverGrab test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should get model with no cover", async () => {
            const albumModel = container.resolve(AlbumModel)
            const albumDAO = container.resolve(AlbumDAO)

            await albumModel.create(getCleanAlbumDb())

            let results = await albumDAO.getAlbumModelToCoverGrab()

            expect(results).toHaveLength(1)
        })

        it("Should get model that never get cover grabbed", async () => {
            const albumModel = container.resolve(AlbumModel)
            const albumDAO = container.resolve(AlbumDAO)

            await albumModel.create(getAlbumDbNeverCoverGrabbed())

            let results = await albumDAO.getAlbumModelToCoverGrab()

            expect(results).toHaveLength(1)
        })

        it("Should get model with cover updated too long ago", async () => {
            const albumModel = container.resolve(AlbumModel)
            const albumDAO = container.resolve(AlbumDAO)

            await albumModel.create(getAlbumDbToCoverGrab())

            let results = await albumDAO.getAlbumModelToCoverGrab()

            expect(results).toHaveLength(1)
        })

        it("Should not get model with cover recently updated", async () => {
            const albumModel = container.resolve(AlbumModel)
            const albumDAO = container.resolve(AlbumDAO)
            const imageModel = container.resolve(ImageModel)

            let id = (await imageModel.create(getCleanImage()))._id
            await albumModel.create({
                ...getCleanAlbumDb(),
                coverV2: id
            })

            let results = await albumDAO.getAlbumModelToCoverGrab()

            expect(results).toHaveLength(0)
        })

        it("Should throw error on model error", async () => {
            const albumModelMock = new AlbumModelMock()
            albumModelMock.find = jest.fn(() => { throw new Error("Test error") })

            const songModel = new SongModel()
            const albumMapper = container.resolve(AlbumMapper)
            const albumDAO = new AlbumDAO(albumModelMock, songModel, albumMapper)

            albumDAO.getAlbumModelToCoverGrab().catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("findAlbumsByMbid test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should find model by mbid", async () => {
            const albumModel = container.resolve(AlbumModel)
            const albumDAO = container.resolve(AlbumDAO)

            await albumModel.create(getCleanAlbumDb())

            let result = await albumDAO.findAlbumsByMbid(getCleanAlbum().mbid ?? "")

            expect(result).toBeDefined()
        })

        it("Should throw error on model error", async () => {
            const albumModelMock = new AlbumModelMock()
            albumModelMock.find = jest.fn(() => { throw new Error("Test error") })

            const songModel = new SongModel()
            const albumMapper = container.resolve(AlbumMapper)
            const albumDAO = new AlbumDAO(albumModelMock, songModel, albumMapper)

            albumDAO.findAlbumsByMbid("").catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("getAlbumModelForMetadataGrabber test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should get model updated too long ago", async () => {
            const albumModel = container.resolve(AlbumModel)
            const albumDAO = container.resolve(AlbumDAO)

            await albumModel.create(getAlbumDbToUpdate())

            let results = await albumDAO.getAlbumModelForMetadataGrabber()

            expect(results).toHaveLength(1)
        })

        it("Should get model never updated", async () => {
            const albumModel = container.resolve(AlbumModel)
            const albumDAO = container.resolve(AlbumDAO)

            await albumModel.create(getAlbumDbNeverUpdated())

            let results = await albumDAO.getAlbumModelForMetadataGrabber()

            expect(results).toHaveLength(1)
        })

        it("Should not get model recently updated", async () => {
            const albumModel = container.resolve(AlbumModel)
            const albumDAO = container.resolve(AlbumDAO)

            await albumModel.create(getCleanAlbumDb())

            let results = await albumDAO.getAlbumModelForMetadataGrabber()

            expect(results).toHaveLength(0)
        })

        it("Should throw error on model error", async () => {
            const albumModelMock = new AlbumModelMock()
            albumModelMock.find = jest.fn(() => { throw new Error("Test error") })

            const songModel = new SongModel()
            const albumMapper = container.resolve(AlbumMapper)
            const albumDAO = new AlbumDAO(albumModelMock, songModel, albumMapper)

            albumDAO.getAlbumModelForMetadataGrabber().catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })
})