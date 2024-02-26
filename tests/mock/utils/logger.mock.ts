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

import { Request } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import { Exception } from "../../../src/utils/Exception";
import { Logger } from "../../../src/utils/logger";

class LoggerMock implements Logger {
    

    public error(this: Logger, exception: Exception): void {}
    public info(this: Logger, info: String, source: String): void {}
    public logRequest(this: Logger, req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>): void {}
    public debug(this: Logger, debugLvl: number, info: String, source: String): void {}
    public debugError(this: Logger, debugLvl: number, exception: Exception): void {}
    
}