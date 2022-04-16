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

import { Document } from "mongoose";
import { Failable } from "../../utils/Failable";
import { songModel } from "./models/songModel";

export async function getAllSongModels(): Promise<Failable<(Song & Document<any, any, Song>)[]>> {
    try {
        return { result: await songModel.find() }
    } catch (err) {
        return {
            failure: {
                file: __filename,
                func: getAllSongModels.name,
                msg: err
            }
        }
    }
}

export async function getSongModel(id: string): Promise<Failable<Song & Document<any, any, Song>>> {
    try {
        return { result: await songModel.findById(id) }
    } catch (err) {
        return {
            failure: {
                file: __filename,
                func: getSongModel.name,
                msg: err
            }
        }
    }
}

export async function updateSongModel(song: Song): Promise<Failable<null>> {
    try {
        await songModel.findByIdAndUpdate(song.id, song)
        return { result: null }
    } catch (err) {
        return {
            failure: {
                file: __filename,
                func: updateSongModel.name,
                msg: err
            }
        }
    }
}

export async function createSongModel(song: Song): Promise<Failable<string>> {
    try {
        return { result: (await songModel.create(song)).id }
    } catch (err) {
        return {
            failure: {
                file: __filename,
                func: createSongModel.name,
                msg: err
            }
        }
    }
}

export async function findSongModelByPath(path: string): Promise<Failable<Song & Document<any, any, Song>>> {
    try {
        return { result: (await songModel.find({ path }))[0] }
    } catch (err) {
        return {
            failure: {
                file: __filename,
                func: findSongModelByPath.name,
                msg: err
            }
        }
    }
}