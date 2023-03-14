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

export abstract class Exception {
  file: string;
  func: string;
  sourceError?: Exception | string;

  public abstract getType(): string

  constructor(file: string, func: string, sourceError?: Exception | string) {
    this.file = file
    this.func = func
    this.sourceError = sourceError
  }

  public isOfType(type: string): boolean {
    if (this.getType() === type) { return true }

    if (this.sourceError && this.sourceError instanceof Exception) {
      return this.sourceError.isOfType(type)
    }

    return false
  }

  public toString(): string {
    let display = `${this.getType()} in file ${this.file}: ${this.func}`

    if (this.sourceError) {
      if (this.sourceError instanceof Exception) {
        display += ` caused by\n${(<Exception>this.sourceError).toString()}`
      } else {
        display += `\nSource error: ${String(this.sourceError)}`
      }
    }

    return display
  }
}