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

import { FilterQuery, Query, Document, Types, Model, ProjectionType } from "mongoose";
import { DeleteResult } from "mongodb";
import { SongModel } from "../../../../src/access/database/models/songModel";
import { SongDb } from "../../../../src/access/database/models/interfaces/songDb";

export class SongModelMock implements SongModel {
    public get model(): Model<SongDb, {}, {}, {}, any> {
        throw new Error("Method not implemented.");
    }

    public find: (query?: FilterQuery<SongDb> | undefined, projection?: ProjectionType<SongDb> | undefined) => Query<(Document<unknown, any, SongDb> & SongDb & { _id: Types.ObjectId; })[], Document<unknown, any, SongDb> & SongDb & { _id: Types.ObjectId; }, {}, SongDb> = jest.fn()

    public findById: (id: string) => Query<(Document<unknown, any, SongDb> & SongDb & { _id: Types.ObjectId; }) | null, Document<unknown, any, SongDb> & SongDb & { _id: Types.ObjectId; }, {}, SongDb> = jest.fn()

    public create: (album: SongDb) => Promise<Document<unknown, any, SongDb> & SongDb & { _id: Types.ObjectId; }> = jest.fn()

    public findByIdAndUpdate: (id: string, song: SongDb) => Query<(Document<unknown, any, SongDb> & SongDb & { _id: Types.ObjectId; }) | null, Document<unknown, any, SongDb> & SongDb & { _id: Types.ObjectId; }, {}, SongDb> = jest.fn()

    public deleteMany: (query?: FilterQuery<SongDb> | undefined) => Query<DeleteResult, Document<unknown, any, SongDb> & SongDb & { _id: Types.ObjectId; }, {}, SongDb> = jest.fn()
}