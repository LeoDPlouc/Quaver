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

import { Document } from "mongoose"
import { injectable, registry } from "tsyringe"
import { Image } from "../models/image"
import { ImageMapper, ImageMapperToken } from "./interfaces/imageMapper.inter"

@injectable()
@registry([{
    token: ImageMapperToken,
    useClass: ImageMapperImpl
}])
export class ImageMapperImpl implements ImageMapper {

    public toImage(data: Image & Document<any, any, Image>): Image {
        let cleanedData: Image = {
            id: data._id,
            path: data.path,
            tiny: data.tiny,
            small: data.small,
            medium: data.medium,
            large: data.large,
            verylarge: data.verylarge
        }
        return cleanedData
    }

    public toImageDTO(data: Image): ImageDTO {
        let cleanedData: ImageDTO = {
            id: data.id
        }
        return cleanedData
    }
}