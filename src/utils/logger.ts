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
import { createLogger, format, level, transports } from "winston";
import { DEBUG_LVL } from "../config/config";
import { createFailure, Failure } from "./Failure";

let loggerStd = createLogger({
  transports: [new transports.Console()],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
});

let loggerDebug = createLogger({
  transports: [new transports.Console({ level: "debug" })],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
});

let loggerFile = createLogger({
  transports: [new transports.File({ dirname: "logs", filename: "quaver.log", maxsize: 1_000_000 })],
  format: format.combine(
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
    loggerFile.error(`${JSON.stringify(error)}`);
  }

  public info(this: Logger, info: String, source: String) {
    loggerStd.info(`${source} : ${info}`);
    loggerFile.info(`${source} : ${info}`);
  }

  public logRequest(this: Logger, req: Request) {
    loggerStd.info(`${req.ip} ${req.url}`);
    loggerFile.info(`${req.ip} ${req.url}`);
  }

  public debug(this: Logger, debugLvl: number, info: String, source: String) {
    if (debugLvl <= DEBUG_LVL && DEBUG_LVL > 0 && debugLvl > 0) {
      loggerDebug.debug(`${source} : ${info}`);
    }
  }

  public debugError(this: Logger, debugLvl: number, msg: string, file: string, func: string, sourceFailure?: Failure) {
    let error = createFailure(msg, file, func, sourceFailure);
    if (debugLvl <= DEBUG_LVL && DEBUG_LVL > 0 && debugLvl > 0) {
      loggerDebug.debug(`ERROR: ${JSON.stringify(error)}`);
    }
  }
}

export const logger = new Logger()