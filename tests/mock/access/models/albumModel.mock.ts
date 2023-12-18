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

import { FilterQuery, Query, Document, Types, Model } from "mongoose";
import { AlbumModel } from "../../../../src/access/database/models/albumModel";
import { AlbumDb } from "../../../../src/access/database/models/interfaces/albumDb";
import { DeleteResult } from "mongodb";

export class AlbumModelMock implements AlbumModel {
    public deleteMany: (query?: FilterQuery<AlbumDb> | undefined) => Query<DeleteResult, Document<unknown, any, AlbumDb> & AlbumDb & { _id: Types.ObjectId; }, {}, AlbumDb> = jest.fn()

    public find: (query?: FilterQuery<AlbumDb>) => Query<(Document<unknown, any, AlbumDb> & AlbumDb & { _id: Types.ObjectId; })[], Document<unknown, any, AlbumDb> & AlbumDb & { _id: Types.ObjectId; }, {}, AlbumDb> = jest.fn()

    public findById: (id: string) => Query<(Document<unknown, any, AlbumDb> & AlbumDb & { _id: Types.ObjectId; }) | null, Document<unknown, any, AlbumDb> & AlbumDb & { _id: Types.ObjectId; }, {}, AlbumDb> = jest.fn()

    public create: (album: AlbumDb) => Promise<Document<unknown, any, AlbumDb> & AlbumDb & { _id: Types.ObjectId; }> = jest.fn()

    public findByIdAndUpdate: (id: string, album: AlbumDb) => Query<(Document<unknown, any, AlbumDb> & AlbumDb & { _id: Types.ObjectId; }) | null, Document<unknown, any, AlbumDb> & AlbumDb & { _id: Types.ObjectId; }, {}, AlbumDb> = jest.fn()
    
    public get model(): Model<AlbumDb, {}, {}, {}, any> {
        throw new Error("Method not implemented.");
    }
}