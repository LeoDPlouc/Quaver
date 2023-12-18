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

import request from "supertest";
import { cleanDatabase } from "../../util";
import app from '../../../src/app'
import { container } from "tsyringe";
import { ArtistModel } from "../../../src/access/database/models/artistModel";
import { getCleanArtistDb } from "../../testData/artistTestData";
import { SongModel } from "../../../src/access/database/models/songModel";
import { getCleanSong, getCleanSongDb } from "../../testData/songTestData";
import { AlbumModel } from "../../../src/access/database/models/albumModel";
import { getCleanAlbumDb } from "../../testData/albumTestData";

describe("Artist", () => {

  describe("Get /artist/", () => {
    beforeEach(cleanDatabase);

    it("Should return all artists", async () => {
      const artistModel = container.resolve(ArtistModel)

      artistModel.create(getCleanArtistDb())

      const res = await request(app).get("/api/artist").expect(200);

      expect(res.body.statusCode).toBe(0);
      expect(res.body.results).toBe(1);
    });
  });

  describe("Get /artist/:id", () => {
    beforeEach(cleanDatabase);

    it("Should return one artist", async () => {
      const artistModel = container.resolve(ArtistModel)

      const id = (await artistModel.create(getCleanArtistDb())).id

      const res = await request(app).get(`/api/artist/${id}`).expect(200);

      expect(res.body.statusCode).toBe(0);
      expect(res.body.data.artist).toBeDefined();
    });

    it("Should fail with id undefined", async () => {
      const res = await request(app).get("/api/artist/undefined").expect(200);

      expect(res.body.statusCode).toBe(2);
    });

    it("Should fail with null id", async () => {
      const res = await request(app).get("/api/artist/null").expect(200);

      expect(res.body.statusCode).toBe(2);
    });
  });

  describe("Get /artist/:id/songs", () => {
    beforeEach(cleanDatabase);

    it("Should return artist's songs", async () => {
      const artistModel = container.resolve(ArtistModel)
      const songModel = container.resolve(SongModel)

      const id = (await artistModel.create(getCleanArtistDb())).id
      await songModel.create({
        ...getCleanSongDb(),
        artists: id
      })

      const res = await request(app).get(`/api/artist/${id}/songs`).expect(200);

      console.log(res.body)

      expect(res.body.statusCode).toBe(0);
      expect(res.body.results).toBe(1);
    });

    it("Should fail with id undefined", async () => {
      const res = await request(app)
        .get("/api/artist/undefined/songs")
        .expect(200);

      expect(res.body.statusCode).toBe(2);
    });

    it("Should fail with null id", async () => {
      const res = await request(app).get("/api/artist/null/songs").expect(200);

      expect(res.body.statusCode).toBe(2);
    });
  });

  describe("Get /artist/:id/albums", () => {
    beforeEach(cleanDatabase);

    it("Should return artist's albums", async () => {
      const artistModel = container.resolve(ArtistModel)
      const albumModel = container.resolve(AlbumModel)

      const id = (await artistModel.create(getCleanArtistDb())).id
      await albumModel.create({
        ...getCleanAlbumDb(),
        artists: id
      })

      const res = await request(app).get(`/api/artist/${id}/albums`).expect(200);

      expect(res.body.statusCode).toBe(0);
      expect(res.body.results).toBe(1);
    });

    it("Should fail with id undefined", async () => {
      const res = await request(app)
        .get("/api/artist/undefined/albums")
        .expect(200);

      expect(res.body.statusCode).toBe(2);
    });

    it("Should fail with null id", async () => {
      const res = await request(app).get("/api/artist/null/albums").expect(200);

      expect(res.body.statusCode).toBe(2);
    });
  });
});