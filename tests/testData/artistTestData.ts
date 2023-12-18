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

import { ArtistDb } from "../../src/access/database/models/interfaces/artistDb"
import { Artist } from "../../src/models/artist"

export function getCleanArtist(): Artist {
    return {
        name: "test name",
        mbid: "1a2z3e4r",
        lastUpdated: Date.now()
    }
}

export function getCleanArtistDb(): ArtistDb {
    return {
        name: "test name",
        mbid: "1a2z3e4r",
        lastUpdated: Date.now()
    }
}

export function getArtistToUpdate(): Artist {
    return {
        lastUpdated: 0
    }
}

export function getArtistDbToUpdate(): ArtistDb {
    return {
        lastUpdated: 0
    }
}

export function getArtistNeverUpdated(): Artist {
    return {}
}


export function getArtistDbNeverUpdated(): ArtistDb {
    return {}
}
