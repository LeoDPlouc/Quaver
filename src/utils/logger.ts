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
import { Failure } from "./Failure";

var logger = createLogger({
  transports: [
    new transports.Console(),
    new transports.File({ dirname: "logs", filename: "quaver.log" }),
  ],
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level}: ${message}`;
    })
  ),
});

export function logError(error: Failure) {
  logger.error(`${JSON.stringify(error)}`);
}

export function logInfo(info: String, source: String) {
  logger.info(`${source} :  ${info}`);
}

export function logRequest(req: Request) {
  logger.info(`${req.ip} ${req.url}`);
}
