// Quaver is a self-hostable music player and music library manager
// Copyright (C) 2024  DPlouc
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

import { Exception } from "../Exception";

export const LoggerToken = Symbol("Logger");

export interface Logger {

    error(exception: Exception): void;

    info(info: String, source: String): void;

    debug(debugLvl: number, info: String, source: String): void;

    debugError(debugLvl: number, exception: Exception): void;
}