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

import { DeleteResult } from "mongodb";
import { Model, Query, Document, Types, FilterQuery } from "mongoose";
import { ImageModel } from "../../../../src/access/database/models/imageModel";
import { Image } from "../../../../src/models/image"

export class ImageModelMock implements ImageModel {
    public get model(): Model<Image, {}, {}, {}, any> {
        throw new Error("Method not implemented.");
    }
    public find: (query?: FilterQuery<Image> | undefined) => Query<(Document<unknown, any, Image> & Image & { _id: Types.ObjectId; })[], Document<unknown, any, Image> & Image & { _id: Types.ObjectId; }, {}, Image> = jest.fn()

    public findById: (id: string) => Query<(Document<unknown, any, Image> & Image & { _id: Types.ObjectId; }) | null, Document<unknown, any, Image> & Image & { _id: Types.ObjectId; }, {}, Image> = jest.fn()

    public create: (album: Image) => Promise<Document<unknown, any, Image> & Image & { _id: Types.ObjectId; }> = jest.fn()

    public findByIdAndUpdate: (id: string, album: Image) => Query<(Document<unknown, any, Image> & Image & { _id: Types.ObjectId; }) | null, Document<unknown, any, Image> & Image & { _id: Types.ObjectId; }, {}, Image> = jest.fn()

    public deleteMany: (query?: FilterQuery<Image> | undefined) => Query<DeleteResult, Document<unknown, any, Image> & Image & { _id: Types.ObjectId; }, {}, Image> = jest.fn()

    public findByIdAndDelete: (id: string) => Query<(Document<unknown, any, Image> & Image & { _id: Types.ObjectId; }) | null, Document<unknown, any, Image> & Image & { _id: Types.ObjectId; }, {}, Image> = jest.fn()
}