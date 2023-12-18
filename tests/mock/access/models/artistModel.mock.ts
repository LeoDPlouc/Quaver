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
import { DeleteResult } from "mongodb";
import { ArtistModel } from "../../../../src/access/database/models/artistModel";
import { ArtistDb } from "../../../../src/access/database/models/interfaces/artistDb";

export class ArtistModelMock implements ArtistModel {
    public get model(): Model<ArtistDb, {}, {}, {}, any> {
        throw new Error("Method not implemented.");
    }
    public find: (query?: FilterQuery<ArtistDb> | undefined) => Query<(Document<unknown, any, ArtistDb> & ArtistDb & { _id: Types.ObjectId; })[], Document<unknown, any, ArtistDb> & ArtistDb & { _id: Types.ObjectId; }, {}, ArtistDb> = jest.fn()

    public findById: (id: string) => Query<(Document<unknown, any, ArtistDb> & ArtistDb & { _id: Types.ObjectId; }) | null, Document<unknown, any, ArtistDb> & ArtistDb & { _id: Types.ObjectId; }, {}, ArtistDb> = jest.fn()

    public create: (artist: ArtistDb) => Promise<Document<unknown, any, ArtistDb> & ArtistDb & { _id: Types.ObjectId; }> = jest.fn()

    public findByIdAndUpdate: (id: string, artist: ArtistDb) => Query<(Document<unknown, any, ArtistDb> & ArtistDb & { _id: Types.ObjectId; }) | null, Document<unknown, any, ArtistDb> & ArtistDb & { _id: Types.ObjectId; }, {}, ArtistDb> = jest.fn()

    public deleteMany: (query?: FilterQuery<ArtistDb> | undefined) => Query<DeleteResult, Document<unknown, any, ArtistDb> & ArtistDb & { _id: Types.ObjectId; }, {}, ArtistDb> = jest.fn()
}