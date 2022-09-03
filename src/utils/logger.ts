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

import { Request } from "express";
import { createLogger, format, transports } from "winston";
import { createFailure, Failure } from "./Failure";

let loggerStd = createLogger({
  transports: [new transports.Console(), new transports.File({ dirname: "logs", filename: "quaver.log" })],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
});

class Logger {
  public error(this: Logger, msg: string, file: string, func: string, sourceFailure?: Failure) {
    let error = createFailure(msg, file, func, sourceFailure);
    loggerStd.error(`${JSON.stringify(error)}`);
  }

  public info(this: Logger, info: String, source: String) {
    loggerStd.info(`${source} : ${info}`);
  }

  public logRequest(this: Logger, req: Request) {
    loggerStd.info(`${req.ip} ${req.url}`);
  }
}

export const logger = new Logger()