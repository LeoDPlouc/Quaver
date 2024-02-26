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
import { DEBUG_LVL } from "../config/config";
import { Exception } from "./Exception";
import { container, injectable, registry } from "tsyringe";
import { PathService } from "../service/pathService";
import { Logger, LoggerToken } from "./interfaces/logger.inter";

@injectable()
@registry([{
  token: LoggerToken,
  useClass: LoggerImpl
}])
export class LoggerImpl implements Logger {

  private loggerStd = createLogger({
    transports: [new transports.Console()],
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
  });

  private loggerDebug = createLogger({
    transports: [new transports.Console({ level: "debug" })],
    format: format.combine(
      format.colorize(),
      format.timestamp(),
      format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
  });

  private loggerFile = createLogger({
    transports: [new transports.File({ dirname: container.resolve(PathService).getLogsPath(), filename: "quaver.log", maxsize: 1_000_000 })],
    format: format.combine(
      format.timestamp(),
      format.printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
  });

  public error(exception: Exception) {
    this.loggerStd.error(`${exception.toString()}`);
    this.loggerFile.error(`${exception.toString()}`);
  }

  public info(info: String, source: String) {
    this.loggerStd.info(`[${source}] : ${info}`);
    this.loggerFile.info(`[${source}] : ${info}`);
  }

  public logRequest(req: Request) {
    this.loggerStd.info(`${req.ip} ${req.url}`);
    this.loggerFile.info(`${req.ip} ${req.url}`);
  }

  public debug(debugLvl: number, info: String, source: String) {
    if (debugLvl <= DEBUG_LVL && DEBUG_LVL > 0 && debugLvl > 0) {
      this.loggerDebug.debug(`[${source}] ${info}`);
    }
  }

  public debugError(debugLvl: number, exception: Exception) {
    if (debugLvl <= DEBUG_LVL && DEBUG_LVL > 0 && debugLvl > 0) {
      this.loggerDebug.debug(`[ERROR] ${exception.toString()}`);
    }
  }
}